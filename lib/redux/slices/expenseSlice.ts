import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ExpenseItem {
  _id: string;
  title: string;
  amount: number;
  category: "Food" | "Transport" | "Shopping" | "Entertainment" | "Bills & Utilities" | "Health" | "Education" | "Others" | string;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

interface ExpenseState {
  items: ExpenseItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentExpense: ExpenseItem | null; // For editing
  filterCategory: string;
  searchQuery: string;
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
}

const initialState: ExpenseState = {
  items: [],
  status: "idle",
  actionStatus: "idle",
  error: null,
  currentExpense: null,
  filterCategory: "All",
  searchQuery: "",
  sortBy: "date-desc",
};

// Async Thunks
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (
    params: { category?: string; search?: string; sort?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== "All") {
        searchParams.append("category", params.category);
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.sort) {
        searchParams.append("sort", params.sort);
      }

      const queryString = searchParams.toString();
      const url = `/api/expenses${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || "Failed to fetch expenses");
      }

      return data.data as ExpenseItem[];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return rejectWithValue(message);
    }
  }
);

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expenseData: ExpenseFormData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || "Failed to add expense");
      }

      return data.data as ExpenseItem;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return rejectWithValue(message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async (
    { id, data: updateData }: { id: string; data: Partial<ExpenseFormData> },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || "Failed to update expense");
      }

      return data.data as ExpenseItem;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return rejectWithValue(message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || "Failed to delete expense");
      }

      return id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return rejectWithValue(message);
    }
  }
);

export const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setCurrentExpense: (state, action: PayloadAction<ExpenseItem | null>) => {
      state.currentExpense = action.payload;
    },
    clearCurrentExpense: (state) => {
      state.currentExpense = null;
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">
    ) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to load expenses";
      })
      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        // Place new expense at beginning
        state.items.unshift(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = (action.payload as string) || "Failed to add expense";
      })
      // Update Expense
      .addCase(updateExpense.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentExpense?._id === action.payload._id) {
          state.currentExpense = null;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = (action.payload as string) || "Failed to update expense";
      })
      // Delete Expense
      .addCase(deleteExpense.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.currentExpense?._id === action.payload) {
          state.currentExpense = null;
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = (action.payload as string) || "Failed to delete expense";
      });
  },
});

export const {
  setCurrentExpense,
  clearCurrentExpense,
  setFilterCategory,
  setSearchQuery,
  setSortBy,
  clearError,
} = expenseSlice.actions;

export default expenseSlice.reducer;
