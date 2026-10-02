"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addExpense, updateExpense, clearCurrentExpense } from "@/lib/redux/slices/expenseSlice";
import { CATEGORIES, getCategoryConfig } from "@/lib/categories";
import { useSession } from "@/lib/auth-client";
import {
  PlusCircle,
  Edit3,
  X,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function ExpenseForm() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { currentExpense, actionStatus, error } = useAppSelector((state) => state.expenses);

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state when currentExpense changes (Edit mode)
  useEffect(() => {
    if (currentExpense) {
      setTitle(currentExpense.title);
      setAmount(String(currentExpense.amount));
      setCategory(currentExpense.category || "Food");
      const formattedDate = currentExpense.date
        ? new Date(currentExpense.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      setDate(formattedDate);
      setNotes(currentExpense.notes || "");
      setValidationError(null);
      setSuccessMessage(null);
    } else {
      // Reset when cancelled or cleared
      resetForm();
    }
  }, [currentExpense]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setValidationError(null);
  };

  const handleCancelEdit = () => {
    dispatch(clearCurrentExpense());
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    if (!session?.user) {
      setValidationError("Please sign in first to record or update your expenses.");
      return;
    }

    // Validation
    if (!title.trim()) {
      setValidationError("Please enter an expense title.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!category) {
      setValidationError("Please select a category.");
      return;
    }

    if (!date) {
      setValidationError("Please select a date.");
      return;
    }

    const payload = {
      title: title.trim(),
      amount: numAmount,
      category,
      date,
      notes: notes.trim(),
    };

    if (currentExpense && currentExpense._id) {
      // Update existing
      const resultAction = await dispatch(
        updateExpense({ id: currentExpense._id, data: payload })
      );
      if (updateExpense.fulfilled.match(resultAction)) {
        setSuccessMessage("Expense updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } else {
      // Add new
      const resultAction = await dispatch(addExpense(payload));
      if (addExpense.fulfilled.match(resultAction)) {
        setSuccessMessage("Expense added successfully!");
        resetForm();
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    }
  };

  const isEditing = Boolean(currentExpense);
  const isLoading = actionStatus === "loading";
  const selectedCatConfig = getCategoryConfig(category);

  return (
    <div
      id="expense-form-container"
      className={`relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg transition-all duration-300 ${
        isEditing
          ? "border-orange-400/80 ring-2 ring-orange-400/20 bg-gradient-to-b from-orange-50/20 to-card"
          : "border-border/80 hover:shadow-xl"
      }`}
    >
      {/* Accent Background Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-[#D85F35]/15 to-[#F5965A]/10 blur-2xl" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${
              isEditing
                ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                : "bg-gradient-to-br from-[#D85F35] to-[#F5965A] text-white"
            }`}
          >
            {isEditing ? <Edit3 className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {isEditing ? "Edit Expense" : "Add New Expense"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEditing
                ? "Update the details and save changes"
                : "Record your transaction to keep track of spending"}
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {/* Alerts */}
      {validationError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label
            htmlFor="expense-title"
            className="mb-1.5 block text-xs font-semibold text-foreground"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="expense-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Grocery Shopping, Uber Ride, Coffee"
              required
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-2.5 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#D85F35] focus:outline-none focus:ring-2 focus:ring-[#D85F35]/20"
            />
          </div>
        </div>

        {/* Amount & Date - 2 columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Amount Field */}
          <div>
            <label
              htmlFor="expense-amount"
              className="mb-1.5 block text-xs font-semibold text-foreground"
            >
              Amount ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full rounded-xl border border-input bg-background/80 py-2.5 pl-9 pr-4 text-sm font-medium text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#D85F35] focus:outline-none focus:ring-2 focus:ring-[#D85F35]/20"
              />
            </div>
          </div>

          {/* Date Picker Field */}
          <div>
            <label
              htmlFor="expense-date"
              className="mb-1.5 block text-xs font-semibold text-foreground"
            >
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                id="expense-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl border border-input bg-background/80 py-2.5 pl-9 pr-4 text-sm text-foreground transition-all duration-200 focus:border-[#D85F35] focus:outline-none focus:ring-2 focus:ring-[#D85F35]/20"
              />
            </div>
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label
            htmlFor="expense-category"
            className="mb-1.5 flex items-center justify-between text-xs font-semibold text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[#D85F35]" />
              Category <span className="text-red-500">*</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
              Selected:
              {(() => {
                const SelectedIcon = selectedCatConfig.icon;
                return (
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <SelectedIcon className="h-3.5 w-3.5 text-[#D85F35]" />
                    {category}
                  </span>
                );
              })()}
            </span>
          </label>

          <div className="relative">
            <select
              id="expense-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full appearance-none rounded-xl border border-input bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 focus:border-[#D85F35] focus:outline-none focus:ring-2 focus:ring-[#D85F35]/20 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-muted-foreground">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Category Quick Selector Chips */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              const CatIcon = cat.icon;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-[#D85F35] to-[#F5965A] text-white shadow-sm scale-105"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <CatIcon className="h-3.5 w-3.5" />
                  <span>{cat.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label
            htmlFor="expense-notes"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground"
          >
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            Notes (Optional)
          </label>
          <textarea
            id="expense-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any extra details, receipt reference, or memo..."
            className="w-full resize-none rounded-xl border border-input bg-background/80 px-4 py-2 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#D85F35] focus:outline-none focus:ring-2 focus:ring-[#D85F35]/20"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-5 font-semibold text-white shadow-md transition-all duration-300 disabled:opacity-60 ${
              isEditing
                ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:shadow-lg"
                : "bg-gradient-to-r from-[#D85F35] to-[#F5965A] hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-500/25"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{isEditing ? "Updating Expense..." : "Adding Expense..."}</span>
              </>
            ) : isEditing ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Update Expense</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Save Expense</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
