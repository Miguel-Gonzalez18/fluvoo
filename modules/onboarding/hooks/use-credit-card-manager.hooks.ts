"use client";

import { useState, useCallback } from "react";
import { CreditCard } from "../types/onboarding";

interface UseCreditCardManagerReturn {
  showForm: boolean;
  editingItem: CreditCard | null;
  handleEdit: (item: CreditCard) => void;
  handleAdd: () => void;
  handleCancel: () => void;
  handleSave: (
    item: CreditCard,
    onAdd: (item: CreditCard) => void,
    onUpdate: (item: CreditCard) => void
  ) => void;
}

export function useCreditCardManager(): UseCreditCardManagerReturn {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CreditCard | null>(null);

  const handleEdit = useCallback((item: CreditCard) => {
    setEditingItem(item);
    setShowForm(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setShowForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingItem(null);
  }, []);

  const handleSave = useCallback(
    (
      item: CreditCard,
      onAdd: (item: CreditCard) => void,
      onUpdate: (item: CreditCard) => void
    ) => {
      if (editingItem) {
        onUpdate(item);
      } else {
        onAdd(item);
      }
      setShowForm(false);
      setEditingItem(null);
    },
    [editingItem]
  );

  return {
    showForm,
    editingItem,
    handleEdit,
    handleAdd,
    handleCancel,
    handleSave,
  };
}
