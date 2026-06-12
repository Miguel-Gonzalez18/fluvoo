"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreditCardDetailSheet } from "@/modules/dashboard/employee/components/transactions/commitments/CreditCardDetailSheet";
import { CreditCardPlastic } from "@/modules/dashboard/employee/components/transactions/commitments/CreditCardPlastic";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { CreditCardCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";

interface CreditCardCarouselProps {
  cards: CreditCardCommitmentItem[];
  total: number;
  className?: string;
}

export function CreditCardCarousel({
  cards,
  total,
  className,
}: CreditCardCarouselProps) {
  const [selectedCard, setSelectedCard] =
    useState<CreditCardCommitmentItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleCardClick = (card: CreditCardCommitmentItem) => {
    setSelectedCard(card);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedCard(null);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-label text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tarjetas
        </h3>
        <p className="text-xs text-muted-foreground">
          {formatDOP(total)} · {cards.length}{" "}
          {cards.length === 1 ? "tarjeta" : "tarjetas"}
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">Sin tarjetas registradas</p>
          <Link
            href="/employee/settings"
            className="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Agregar en configuración
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {cards.map((card) => (
            <CreditCardPlastic
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      )}

      <CreditCardDetailSheet
        card={selectedCard}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
}
