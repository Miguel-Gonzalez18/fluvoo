"use client";

import { useState } from "react";
import { sileo } from "sileo";
import { parseLoanDocumentText } from "@/modules/dashboard/employee/lib/obligations/parse-loan-document-text";
import type { ParsedLoanDocumentFields } from "@/modules/dashboard/employee/lib/obligations/parse-loan-document-text";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";

interface LoanAmortizationUploadProps {
  onApply: (fields: ParsedLoanDocumentFields) => void;
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

interface ConfirmFormState {
  originalAmount: string;
  currentBalance: string;
  annualRate: string;
  termMonths: string;
  monthlyPayment: string;
  paymentDueDay: string;
  startDate: string;
}

function toConfirmForm(parsed: ParsedLoanDocumentFields): ConfirmFormState {
  return {
    originalAmount: parsed.originalAmount != null ? String(parsed.originalAmount) : "",
    currentBalance:
      parsed.currentBalance != null ? String(parsed.currentBalance) : "",
    annualRate: parsed.annualRate != null ? String(parsed.annualRate) : "",
    termMonths: parsed.termMonths != null ? String(parsed.termMonths) : "",
    monthlyPayment:
      parsed.monthlyPayment != null ? String(parsed.monthlyPayment) : "",
    paymentDueDay:
      parsed.paymentDueDay != null ? String(parsed.paymentDueDay) : "",
    startDate: parsed.startDate ?? "",
  };
}

export function LoanAmortizationUpload({ onApply }: LoanAmortizationUploadProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "confirm">("upload");
  const [parsedSnapshot, setParsedSnapshot] = useState<ParsedLoanDocumentFields | null>(
    null
  );
  const [form, setForm] = useState<ConfirmFormState>({
    originalAmount: "",
    currentBalance: "",
    annualRate: "",
    termMonths: "",
    monthlyPayment: "",
    paymentDueDay: "",
    startDate: "",
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
          const parsed = parseLoanDocumentText(text);
          setParsedSnapshot(parsed);
          setForm(toConfirmForm(parsed));
          setStep("confirm");
        } finally {
          setIsExtracting(false);
        }
      },
      {
        loading: { title: "Leyendo PDF..." },
        success: { title: "Datos listos para confirmar" },
        error: (err) => ({
          title:
            err instanceof Error
              ? err.message.includes("password")
                ? "No se pudo leer el PDF. Verifica la contraseña."
                : err.message
              : "No se pudo leer el PDF. Verifica la contraseña.",
        }),
      }
    );
  };

  const handleApply = () => {
    const fields: ParsedLoanDocumentFields = {
      loanAlias: parsedSnapshot?.loanAlias ?? null,
      originalAmount: form.originalAmount ? Number(form.originalAmount) : null,
      currentBalance: form.currentBalance ? Number(form.currentBalance) : null,
      annualRate: form.annualRate ? Number(form.annualRate) : null,
      termMonths: form.termMonths ? Number(form.termMonths) : null,
      monthlyPayment: form.monthlyPayment ? Number(form.monthlyPayment) : null,
      paymentDueDay: form.paymentDueDay ? Number(form.paymentDueDay) : null,
      startDate: form.startDate || null,
    };

    onApply(fields);
    setStep("upload");
    setFile(null);
    setPassword("");
    setParsedSnapshot(null);
    sileo.success({ title: "Datos del PDF aplicados al formulario" });
  };

  if (step === "confirm") {
    return (
      <div className="space-y-3 rounded-md border border-border bg-muted/20 p-3">
        <div>
          <p className="text-sm font-medium">Confirmar datos del PDF</p>
          <p className="text-xs text-muted-foreground">
            Revisa los valores antes de aplicarlos. El archivo no se guarda en
            nuestros servidores.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Monto original</Label>
            <Input
              type="number"
              value={form.originalAmount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, originalAmount: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Saldo actual</Label>
            <Input
              type="number"
              value={form.currentBalance}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, currentBalance: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tasa anual (%)</Label>
            <Input
              type="number"
              value={form.annualRate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, annualRate: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Plazo (meses)</Label>
            <Input
              type="number"
              value={form.termMonths}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, termMonths: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Cuota mensual</Label>
            <Input
              type="number"
              value={form.monthlyPayment}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, monthlyPayment: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Día de pago</Label>
            <Input
              type="number"
              min={1}
              max={31}
              value={form.paymentDueDay}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, paymentDueDay: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">Fecha de inicio</Label>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStep("upload")}
          >
            Volver
          </Button>
          <Button type="button" size="sm" onClick={handleApply}>
            Aplicar al formulario
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-dashed border-border bg-muted/20 p-3">
      <div>
        <p className="text-sm font-medium">Importar desde PDF (opcional)</p>
        <p className="text-xs text-muted-foreground">
          Sube tu tabla de amortización o contrato. Los datos se procesan en tu
          navegador; revisa antes de guardar.
        </p>
      </div>
      <Input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div className="space-y-1">
        <Label className="text-xs">Contraseña del PDF (si aplica)</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Opcional"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={!file || isExtracting}
        onClick={handleExtract}
      >
        {isExtracting ? "Leyendo…" : "Leer PDF"}
      </Button>
    </div>
  );
}
