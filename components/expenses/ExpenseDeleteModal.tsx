"use client";

import React from "react";
import { formatCurrency, formatDate, getCategoryConfig } from "@/lib/categories";
import { ExpenseItem } from "@/lib/redux/slices/expenseSlice";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface ExpenseDeleteModalProps {
  isOpen: boolean;
  expense: ExpenseItem | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExpenseDeleteModal({
  isOpen,
  expense,
  isLoading,
  onConfirm,
  onCancel,
}: ExpenseDeleteModalProps) {
  if (!isOpen || !expense) return null;

  const categoryConfig = getCategoryConfig(expense.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl transition-all">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-xl font-bold text-foreground">
            Delete Expense?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete this expense record? This action cannot be undone.
          </p>

          {/* Expense Snapshot Card */}
          <div className="my-5 w-full rounded-2xl border border-border/80 bg-muted/40 p-4 text-left">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-sm">
                {expense.title}
              </span>
              <span className="text-base font-bold text-red-600 dark:text-red-400">
                {formatCurrency(expense.amount)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              {(() => {
                const CategoryIcon = categoryConfig.icon;
                return (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-0.5 font-medium border border-border/60">
                    <CategoryIcon className="h-3.5 w-3.5" style={{ color: categoryConfig.color }} />
                    <span>{expense.category}</span>
                  </span>
                );
              })()}
              <span>•</span>
              <span>{formatDate(expense.date)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-1/2 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex w-1/2 items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
