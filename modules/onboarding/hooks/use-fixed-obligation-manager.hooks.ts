"use client";

import { useState, useCallback } from "react";
import { FixedObligation } from "../types/onboarding";

interface UseFixedObligationManagerReturn {
  showForm: boolean;
  editingItem: FixedObligation | null;
  handleEdit: (item: FixedObligation) => void;
  handleAdd: () => void;
  handleCancel: () => void;
  handleSave: (
    item: FixedObligation,
    onAdd: (item: FixedObligation) => void,
    onUpdate: (item: FixedObligation) => void
  ) => void;
}

export function useFixedObligationManager(): UseFixedObligationManagerReturn {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FixedObligation | null>(null);

  const handleEdit = useCallback((item: FixedObligation) => {
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
      item: FixedObligation,
      onAdd: (item: FixedObligation) => void,
      onUpdate: (item: FixedObligation) => void
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
