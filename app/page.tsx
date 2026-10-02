import React from "react";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseList from "@/components/expenses/ExpenseList";
import { WalletCards, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Hero Banner */}


      {/* Expense Summary & Stats Section */}
      <section aria-label="Expense Summary">
        <ExpenseSummary />
      </section>

      {/* Main Content: Form + List Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Add / Edit Form */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <ExpenseForm />
        </div>

        {/* Right Column: Expense List View */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ExpenseList />
        </div>
      </div>
    </main>
  );
}
