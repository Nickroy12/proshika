import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense {
  _id?: string;
  userId: string;
  userEmail?: string;
  title: string;
  amount: number;
  category: "Food" | "Transport" | "Shopping" | "Entertainment" | "Bills & Utilities" | "Health" | "Education" | "Others" | string;
  date: Date | string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IExpenseDocument extends Omit<IExpense, "_id">, Document {}

const ExpenseSchema: Schema<IExpenseDocument> = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    userEmail: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Health",
        "Education",
        "Others",
      ],
      default: "Others",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user and date queries
ExpenseSchema.index({ userId: 1, date: -1 });

// Prevent mongoose overwrite model error in dev mode
const Expense: Model<IExpenseDocument> =
  mongoose.models.Expense || mongoose.model<IExpenseDocument>("Expense", ExpenseSchema);

export default Expense;
