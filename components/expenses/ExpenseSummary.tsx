"use client";

import React from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { formatCurrency, CATEGORIES, getCategoryConfig } from "@/lib/categories";
import { DollarSign, TrendingUp, Receipt, PieChart, Sparkles } from "lucide-react";

export default function ExpenseSummary() {
  const { items, status } = useAppSelector((state) => state.expenses);

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalCount = items.length;
  
  const highestExpense = items.length > 0 
    ? Math.max(...items.map((item) => Number(item.amount) || 0)) 
    : 0;

  const averageExpense = totalCount > 0 ? totalAmount / totalCount : 0;

  // Calculate category breakdowns
  const categoryTotals = items.reduce((acc, item) => {
    const cat = item.category || "Others";
    acc[cat] = (acc[cat] || 0) + Number(item.amount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Primary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Expense - Highlight Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D85F35] via-[#E87942] to-[#F5965A] p-6 text-white shadow-xl shadow-orange-500/15 transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-xl"></div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-wider text-orange-100">
              Total Expenses
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {status === "loading" && items.length === 0 ? (
                <span className="inline-block h-9 w-36 animate-pulse rounded bg-white/30" />
              ) : (
                formatCurrency(totalAmount)
              )}
            </h2>
            <p className="mt-1 flex items-center text-xs text-orange-100/90 font-medium">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Across {totalCount} total {totalCount === 1 ? "record" : "records"}
            </p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Transactions</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              {totalCount}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Logged transactions
            </p>
          </div>
        </div>

        {/* Highest Single Expense */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Highest Expense</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              {formatCurrency(highestExpense)}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Peak single transaction
            </p>
          </div>
        </div>

        {/* Average Expense */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Average / Entry</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <PieChart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              {formatCurrency(averageExpense)}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Average per transaction
            </p>
          </div>
        </div>
      </div>

      {/* Category Spending Breakdown Bar (When there are items) */}
      {totalAmount > 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>Category Distribution</span>
              <span className="text-xs font-normal text-muted-foreground">
                ({Object.keys(categoryTotals).length} active categories)
              </span>
            </h4>
          </div>

          {/* Progress Multi-Bar */}
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const percentage = Math.round((amount / totalAmount) * 100);
              const config = getCategoryConfig(cat);
              if (percentage <= 0) return null;
              return (
                <div
                  key={cat}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.color,
                  }}
                  className="transition-all duration-500 hover:opacity-85"
                  title={`${config.name}: ${formatCurrency(amount)} (${percentage}%)`}
                />
              );
            })}
          </div>

          {/* Category Mini Legend Pills */}
          <div className="mt-3.5 flex flex-wrap gap-2 text-xs">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const percentage = ((amount / totalAmount) * 100).toFixed(0);
              const config = getCategoryConfig(cat);
              const IconComponent = config.icon;
              return (
                <div
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs text-foreground"
                >
                  <IconComponent
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: config.color }}
                  />
                  <span className="font-medium">{cat}</span>
                  <span className="font-semibold text-muted-foreground">
                    {formatCurrency(amount)}
                  </span>
                  <span className="rounded bg-background px-1 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
