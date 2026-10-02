"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchExpenses,
  deleteExpense,
  setCurrentExpense,
  setFilterCategory,
  setSearchQuery,
  setSortBy,
  ExpenseItem,
} from "@/lib/redux/slices/expenseSlice";
import { useSession } from "@/lib/auth-client";
import { formatCurrency, formatDate, getCategoryConfig, CATEGORIES } from "@/lib/categories";
import ExpenseDeleteModal from "./ExpenseDeleteModal";
import Link from "next/link";
import {
  Edit2,
  Trash2,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  ArrowUpDown,
  RefreshCw,
  Inbox,
  Sparkles,
  Lock,
  LogIn,
} from "lucide-react";

export default function ExpenseList() {
  const dispatch = useAppDispatch();
  const { data: session, isPending: isAuthPending } = useSession();

  const {
    items,
    status,
    actionStatus,
    error,
    currentExpense,
    filterCategory,
    searchQuery,
    sortBy,
  } = useAppSelector((state) => state.expenses);

  // Local View State
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch only when user is authenticated
  useEffect(() => {
    if (session?.user) {
      dispatch(fetchExpenses());
    }
  }, [dispatch, session?.user]);

  // Handle Edit
  const handleEdit = (expense: ExpenseItem) => {
    dispatch(setCurrentExpense(expense));
    // Smooth scroll to form on mobile/desktop
    const formElement = document.getElementById("expense-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle Delete Modal
  const openDeleteModal = (expense: ExpenseItem) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      await dispatch(deleteExpense(expenseToDelete._id));
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  // Filter and Sort locally or via Redux state
  const filteredExpenses = useMemo(() => {
    let result = [...items];

    // Category Filter
    if (filterCategory && filterCategory !== "All") {
      result = result.filter(
        (item) => item.category?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      const amountA = Number(a.amount);
      const amountB = Number(b.amount);

      if (sortBy === "date-desc") return dateB - dateA;
      if (sortBy === "date-asc") return dateA - dateB;
      if (sortBy === "amount-desc") return amountB - amountA;
      if (sortBy === "amount-asc") return amountA - amountB;
      return 0;
    });

    return result;
  }, [items, filterCategory, searchQuery, sortBy]);

  // Total for current filtered view
  const currentTotal = filteredExpenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  // If user is not logged in, prompt sign in to view personal expenses
  if (!isAuthPending && !session?.user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-orange-300 bg-orange-50/40 p-10 text-center dark:border-orange-900/50 dark:bg-orange-950/20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-[#D85F35] shadow-sm dark:bg-orange-900/40">
          <Lock className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-foreground">
          Sign In to View Your Expense History
        </h3>
        <p className="mt-1.5 max-w-md text-xs text-muted-foreground">
          Your expense history is completely private and secure. Please log in or create an account to view and manage your transactions.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D85F35] to-[#F5965A] px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:scale-105"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In Now</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
          >
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Header Controls */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
        {/* Top bar: Filter Header & View Switcher */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">My Expense History</h3>
              <span className="rounded-full bg-orange-100 dark:bg-orange-950/60 px-2.5 py-0.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? "record" : "records"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Showing personal expenses for <strong>{session?.user?.name || session?.user?.email}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher (Desktop) */}
            <div className="hidden lg:flex items-center rounded-xl border border-border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === "table"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                title="Table View"
              >
                <TableIcon className="h-4 w-4" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === "grid"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                title="Card Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Cards</span>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => dispatch(fetchExpenses())}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              title="Refresh Expenses"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${status === "loading" ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-12">
          {/* Search Input */}
          <div className="relative sm:col-span-7 md:col-span-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search your expenses by title or note..."
              className="w-full rounded-xl border border-input bg-background/90 py-2 pl-9 pr-4 text-sm text-foreground transition-all placeholder:text-muted-foreground/60 focus:border-[#D85F35] focus:outline-none focus:ring-2 focus:ring-[#D85F35]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => dispatch(setSearchQuery(""))}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative sm:col-span-5 md:col-span-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <ArrowUpDown className="h-4 w-4" />
            </div>
            <select
              value={sortBy}
              onChange={(e) =>
                dispatch(
                  setSortBy(
                    e.target.value as "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
                  )
                )
              }
              className="w-full appearance-none rounded-xl border border-input bg-background/90 py-2 pl-9 pr-8 text-sm font-semibold text-foreground transition-all focus:border-[#D85F35] focus:outline-none focus:ring-2 focus:ring-[#D85F35]/20 cursor-pointer"
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="amount-desc">Highest Amount ($$$)</option>
              <option value="amount-asc">Lowest Amount ($)</option>
            </select>
          </div>
        </div>

        {/* Category Badges Filter Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-4">
          <span className="mr-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Category:
          </span>

          <button
            type="button"
            onClick={() => dispatch(setFilterCategory("All"))}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${filterCategory === "All"
              ? "bg-[#D85F35] text-white shadow-sm"
              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            All ({items.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = items.filter((item) => item.category === cat.id).length;
            const isSelected = filterCategory === cat.id;
            const CatIcon = cat.icon;

            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => dispatch(setFilterCategory(cat.id))}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${isSelected
                  ? "bg-[#D85F35] text-white shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <CatIcon className="h-3.5 w-3.5" />
                <span>{cat.id}</span>
                {count > 0 && (
                  <span
                    className={`rounded px-1 text-[10px] font-bold ${isSelected ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
                      }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Summary Banner (when filtered) */}
      {(filterCategory !== "All" || searchQuery) && (
        <div className="flex items-center justify-between rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/40 px-5 py-3 text-xs text-orange-900 dark:text-orange-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-500 shrink-0" />
            <span>
              Filtered Total: <strong className="text-sm font-bold">{formatCurrency(currentTotal)}</strong> across {filteredExpenses.length} results
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(setFilterCategory("All"));
              dispatch(setSearchQuery(""));
            }}
            className="font-semibold underline hover:text-orange-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {status === "loading" && items.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-16 w-full animate-pulse rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      )}

      {/* Error View */}
      {status === "failed" && items.length === 0 && (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {error || "Failed to load expenses from server."}
          </p>
          <button
            type="button"
            onClick={() => dispatch(fetchExpenses())}
            className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {status !== "loading" && filteredExpenses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 dark:bg-orange-950/40 text-[#D85F35]">
            <Inbox className="h-8 w-8" />
          </div>
          <h4 className="mt-4 text-base font-bold text-foreground">
            No Personal Expenses Found
          </h4>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {searchQuery || filterCategory !== "All"
              ? "No expenses matched your selected filter or search keyword. Try clearing them to see all records."
              : "You haven't recorded any expenses yet. Use the form to record your first transaction!"}
          </p>
        </div>
      )}

      {/* Mobile & Tablet Card View (Always active on mobile & tablet) */}
      {filteredExpenses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {filteredExpenses.map((expense) => {
            const catConfig = getCategoryConfig(expense.category);
            const isBeingEdited = currentExpense?._id === expense._id;
            const CatIcon = catConfig.icon;

            return (
              <div
                key={expense._id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md ${isBeingEdited
                  ? "border-orange-400 ring-2 ring-orange-400/30 bg-orange-50/20"
                  : "border-border/80 hover:border-orange-200"
                  }`}
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${catConfig.bgLight} ${catConfig.borderColor}`}
                    >
                      <CatIcon className="h-3.5 w-3.5" />
                      <span>{expense.category}</span>
                    </span>

                    <span className="text-lg font-extrabold text-[#D85F35]">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>

                  <h4 className="mt-3 text-base font-bold text-foreground">
                    {expense.title}
                  </h4>

                  {expense.notes && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {expense.notes}
                    </p>
                  )}
                </div>

                {/* Card Bottom: Date and Edit/Delete Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(expense.date)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(expense)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${isBeingEdited
                        ? "bg-orange-500 text-white"
                        : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/50"
                        }`}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(expense)}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Desktop View: Table or Card Grid based on viewMode */}
      {filteredExpenses.length > 0 && (
        <div className="hidden lg:block">
          {viewMode === "table" ? (
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border/70 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-6 py-4">Title & Details</th>
                      <th scope="col" className="px-6 py-4">Category</th>
                      <th scope="col" className="px-6 py-4">Date</th>
                      <th scope="col" className="px-6 py-4 text-right">Amount</th>
                      <th scope="col" className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredExpenses.map((expense) => {
                      const catConfig = getCategoryConfig(expense.category);
                      const isBeingEdited = currentExpense?._id === expense._id;
                      const CatIcon = catConfig.icon;

                      return (
                        <tr
                          key={expense._id}
                          className={`group transition-colors duration-150 ${isBeingEdited
                            ? "bg-orange-50/70 dark:bg-orange-950/40 font-semibold"
                            : "hover:bg-muted/40"
                            }`}
                        >
                          {/* Title & Notes */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base shadow-sm"
                                style={{
                                  backgroundColor: `${catConfig.color}18`,
                                }}
                              >
                                <CatIcon
                                  className="h-4 w-4"
                                  style={{ color: catConfig.color }}
                                />
                              </span>
                              <div>
                                <div className="font-semibold text-foreground">
                                  {expense.title}
                                </div>
                                {expense.notes && (
                                  <div className="max-w-xs truncate text-xs text-muted-foreground">
                                    {expense.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${catConfig.bgLight} ${catConfig.borderColor}`}
                            >
                              <CatIcon className="h-3.5 w-3.5" />
                              <span>{expense.category}</span>
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{formatDate(expense.date)}</span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-4 text-right font-bold text-foreground text-sm whitespace-nowrap">
                            <span className="text-[#D85F35]">
                              {formatCurrency(expense.amount)}
                            </span>
                          </td>

                          {/* Edit & Delete Action Buttons */}
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEdit(expense)}
                                className={`rounded-lg p-2 text-xs font-semibold transition-all ${isBeingEdited
                                  ? "bg-orange-500 text-white shadow-sm"
                                  : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/50"
                                  }`}
                                title="Edit Expense"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(expense)}
                                className="rounded-lg p-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                                title="Delete Expense"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredExpenses.map((expense) => {
                const catConfig = getCategoryConfig(expense.category);
                const isBeingEdited = currentExpense?._id === expense._id;
                const CatIcon = catConfig.icon;

                return (
                  <div
                    key={expense._id}
                    className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md ${isBeingEdited
                      ? "border-orange-400 ring-2 ring-orange-400/30 bg-orange-50/20"
                      : "border-border/80 hover:border-orange-200"
                      }`}
                  >
                    {/* Card Top */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${catConfig.bgLight} ${catConfig.borderColor}`}
                        >
                          <CatIcon className="h-3.5 w-3.5" />
                          <span>{expense.category}</span>
                        </span>

                        <span className="text-lg font-extrabold text-[#D85F35]">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>

                      <h4 className="mt-3 text-base font-bold text-foreground">
                        {expense.title}
                      </h4>

                      {expense.notes && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {expense.notes}
                        </p>
                      )}
                    </div>

                    {/* Card Bottom */}
                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(expense.date)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(expense)}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${isBeingEdited
                            ? "bg-orange-500 text-white"
                            : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/50"
                            }`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(expense)}
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ExpenseDeleteModal
        isOpen={isDeleteModalOpen}
        expense={expenseToDelete}
        isLoading={actionStatus === "loading"}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
      />
    </div>
  );
}
