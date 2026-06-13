"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import {
  applyStatementUpload,
  getStatementUploadSignedUrl,
} from "@/modules/dashboard/employee/actions/credit-card-obligations-actions";
import {
  CREDIT_CARD_PAYMENT_AFTER_CLOSE_MESSAGE,
  dayNumberToNextDate,
  derivePaymentDueFromClose,
  isPaymentDueAfterStatementClose,
  addDaysYmd,
} from "@/modules/dashboard/employee/lib/credit-card-dates";
import { parseStatementText } from "@/modules/dashboard/employee/lib/obligations/parse-statement-text";
import type { CreditCardCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";

interface CreditCardStatementUploadProps {
  card: CreditCardCommitmentItem;
}

interface ConfirmFormState {
  statementBalance: string;
  statementBalanceUsd: string;
  minimumPayment: string;
  currentBalance: string;
  nextStatementCloseDate: string;
  nextPaymentDueDate: string;
}

async function extractPdfText(file: File, password: string): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }

  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: buffer,
    password: password || undefined,
  });

  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(pageText);
  }

  return pages.join("\n");
}

export function CreditCardStatementUpload({ card }: CreditCardStatementUploadProps) {
  const router = useRouter();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "confirm">("upload");
  const [storagePath, setStoragePath] = useState("");
  const [form, setForm] = useState<ConfirmFormState>({
    statementBalance: String(card.statementBalanceDop),
    statementBalanceUsd: String(card.statementBalanceUsd),
    minimumPayment: String(card.revolvingDop),
    currentBalance: String(card.totalBalanceDop),
    nextStatementCloseDate: card.nextStatementCloseDate,
    nextPaymentDueDate: card.nextPaymentDueDate,
  });

  const handleExtract = () => {
    if (!file) {
      setError("Selecciona un PDF");
      return;
    }
    if (isExtracting) return;

    setError(null);
    setIsExtracting(true);

    sileo.promise(
      async () => {
        try {
          const text = await extractPdfText(file, password);
          const parsed = parseStatementText(text, card.issuerName);

          const nextStatementCloseDate =
            parsed.statementCloseDay != null
              ? dayNumberToNextDate(parsed.statementCloseDay)
              : form.nextStatementCloseDate;
          let nextPaymentDueDate =
            parsed.paymentDueDay != null
              ? dayNumberToNextDate(parsed.paymentDueDay)
              : form.nextPaymentDueDate;

          if (
            !isPaymentDueAfterStatementClose(
              nextPaymentDueDate,
              nextStatementCloseDate
            )
          ) {
            nextPaymentDueDate = derivePaymentDueFromClose(nextStatementCloseDate);
          }

          setForm({
            statementBalance:
              parsed.statementBalance != null
                ? String(parsed.statementBalance)
                : form.statementBalance,
            statementBalanceUsd:
              parsed.statementBalanceUsd != null
                ? String(parsed.statementBalanceUsd)
                : form.statementBalanceUsd,
            minimumPayment:
              parsed.minimumPayment != null
                ? String(parsed.minimumPayment)
                : form.minimumPayment,
            currentBalance:
              parsed.currentBalance != null
                ? String(parsed.currentBalance)
                : form.currentBalance,
            nextStatementCloseDate,
            nextPaymentDueDate,
          });

          const uploadPrep = await getStatementUploadSignedUrl(card.id, file.name);
          if ("error" in uploadPrep) {
            throw new Error(uploadPrep.error);
          }

          const uploadResponse = await fetch(uploadPrep.signedUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/pdf" },
            body: file,
          });

          if (!uploadResponse.ok) {
            throw new Error("No se pudo subir el PDF");
          }

          setStoragePath(uploadPrep.path);
          setStep("confirm");
        } finally {
          setIsExtracting(false);
        }
      },
      {
        loading: { title: "Leyendo y subiendo PDF..." },
        success: { title: "PDF listo para confirmar" },
        error: (error) => ({
          title:
            error instanceof Error
              ? error.message.includes("password")
                ? "No se pudo leer el PDF. Verifica la contraseña."
                : error.message
              : "No se pudo leer el PDF. Verifica la contraseña.",
        }),
      }
    );
  };

  const handleApply = () => {
    if (isApplying) return;

    if (
      !isPaymentDueAfterStatementClose(
        form.nextPaymentDueDate,
        form.nextStatementCloseDate
      )
    ) {
      setError(CREDIT_CARD_PAYMENT_AFTER_CLOSE_MESSAGE);
      return;
    }

    setError(null);
    setIsApplying(true);
    sileo.promise(
      async () => {
        try {
          const result = await applyStatementUpload({
            cardId: card.id,
            storagePath,
            statementBalance: Number(form.statementBalance),
            statementBalanceUsd: Number(form.statementBalanceUsd),
            minimumPayment: Number(form.minimumPayment),
            currentBalance: Number(form.currentBalance),
            nextStatementCloseDate: form.nextStatementCloseDate || null,
            nextPaymentDueDate: form.nextPaymentDueDate || null,
            parsedSnapshot: { ...form },
          });

          if (!result.success) {
            throw new Error(result.error ?? "No se pudo aplicar el estado de cuenta");
          }

          setStep("upload");
          setFile(null);
          setPassword("");
          router.refresh();
        } finally {
          setIsApplying(false);
        }
      },
      {
        loading: { title: "Aplicando estado de cuenta..." },
        success: { title: "Saldos actualizados" },
        error: (error) => ({
          title:
            error instanceof Error
              ? error.message
              : "No se pudo aplicar el estado de cuenta",
        }),
      }
    );
  };

  if (step === "confirm") {
    return (
      <section className="space-y-3 rounded-md border border-border px-3 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Confirmar estado de cuenta
        </p>
        <p className="text-xs text-muted-foreground">
          Revisa y corrige los valores extraídos del PDF antes de aplicarlos.
        </p>
        <div className="grid grid-cols-1 gap-2">
          <Field
            label="Saldo al corte (RD$)"
            value={form.statementBalance}
            onChange={(v) => setForm((f) => ({ ...f, statementBalance: v }))}
          />
          <Field
            label="Saldo al corte (USD)"
            value={form.statementBalanceUsd}
            onChange={(v) => setForm((f) => ({ ...f, statementBalanceUsd: v }))}
          />
          <Field
            label="Pago mínimo (RD$)"
            value={form.minimumPayment}
            onChange={(v) => setForm((f) => ({ ...f, minimumPayment: v }))}
          />
          <Field
            label="Saldo total (RD$)"
            value={form.currentBalance}
            onChange={(v) => setForm((f) => ({ ...f, currentBalance: v }))}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <DateField
              label="Próxima fecha de corte"
              value={form.nextStatementCloseDate}
              onChange={(v) =>
                setForm((f) => ({ ...f, nextStatementCloseDate: v }))
              }
            />
            <DateField
              label="Próxima fecha límite de pago"
              value={form.nextPaymentDueDate}
              min={
                form.nextStatementCloseDate
                  ? addDaysYmd(form.nextStatementCloseDate, 1)
                  : undefined
              }
              onChange={(v) => setForm((f) => ({ ...f, nextPaymentDueDate: v }))}
            />
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button type="button" size="sm" disabled={isApplying} onClick={handleApply}>
            {isApplying ? "Aplicando…" : "Aplicar saldos"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setStep("upload")}
          >
            Volver
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3 rounded-md border border-dashed border-border px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Estado de cuenta (PDF)
      </p>
      <p className="text-xs text-muted-foreground">
        Sube el PDF de tu estado de cuenta. La contraseña se usa solo en tu
        navegador para leer el archivo.
      </p>
      <div className="space-y-2">
        <Label htmlFor={`statement-file-${card.id}`} className="text-xs">
          Archivo PDF
        </Label>
        <Input
          id={`statement-file-${card.id}`}
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`statement-password-${card.id}`} className="text-xs">
          Contraseña del PDF (si aplica)
        </Label>
        <Input
          id={`statement-password-${card.id}`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isExtracting || !file}
        onClick={handleExtract}
      >
        {isExtracting ? "Procesando…" : "Leer PDF y continuar"}
      </Button>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function DateField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
