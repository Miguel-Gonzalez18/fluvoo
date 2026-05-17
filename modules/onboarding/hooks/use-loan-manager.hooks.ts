"use client";

import { useState, useCallback } from "react";
import { Loan } from "../types/onboarding";

interface UseLoanManagerReturn {
  showLoanForm: boolean;
  editingLoan: Loan | null;
  setShowLoanForm: (show: boolean) => void;
  setEditingLoan: (loan: Loan | null) => void;
  handleEdit: (loan: Loan) => void;
  handleAdd: () => void;
  handleCancel: () => void;
  handleSave: (loan: Loan, onAddLoan: (loan: Loan) => void, onUpdateLoan: (loan: Loan) => void) => void;
}

export function useLoanManager(): UseLoanManagerReturn {
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const handleEdit = useCallback((loan: Loan) => {
    setEditingLoan(loan);
    setShowLoanForm(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingLoan(null);
    setShowLoanForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowLoanForm(false);
    setEditingLoan(null);
  }, []);

  const handleSave = useCallback((
    loan: Loan,
    onAddLoan: (loan: Loan) => void,
    onUpdateLoan: (loan: Loan) => void
  ) => {
    if (editingLoan) {
      onUpdateLoan(loan);
    } else {
      onAddLoan(loan);
    }
    setShowLoanForm(false);
    setEditingLoan(null);
  }, [editingLoan]);

  return {
    showLoanForm,
    editingLoan,
    setShowLoanForm,
    setEditingLoan,
    handleEdit,
    handleAdd,
    handleCancel,
    handleSave,
  };
}
