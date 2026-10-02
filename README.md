# 📊 Expense Tracker & Finance Manager (গোরগৃহ / Proshikha)

একটি আধুনিক ফুলস্ট্যাক **Next.js (App Router)** প্রজেক্ট, যেখানে ডাটাবেজ পরিচালনার জন্য **Mongoose (MongoDB)** এবং গ্লোবাল স্টেট ম্যানেজমেন্টের জন্য **Redux Toolkit (RTK)** ব্যবহার করা হয়েছে।

এই ডকুমেন্টেশনে একদম সহজ বাংলায় স্টেপ-বাই-স্টেপ ব্যাখ্যা করা হয়েছে কীভাবে প্রজেক্টটি সাজানো এবং **Mongoose** ও **Redux** কীভাবে কাজ করছে।

---

## 📑 সূচিপত্র (Table of Contents)
1. [প্রজেক্টের ফোল্ডার স্ট্রাকচার](#১-প্রজেক্টের-ফোল্ডার-স্ট্রাকচার-folder-structure)
2. [Mongoose আর্কিটেকচার ও ডাটাবেজ গাইড](#২-mongoose-আর্কিটেকচার-ও-ডাটাবেজ-গাইড)
   - [ক) ডাটাবেজ কানেকশন (`lib/mongoose.ts`)](#ক-ডাটাবেজ-কানেকশন-libmongoosets)
   - [খ) স্কিমা ও মডেল (`models/Expense.ts`)](#খ-স্কিমা-ও-মডেল-modelsexpensets)
   - [গ) API রাউটে Mongoose এর ব্যবহার (`app/api/expenses/`)](#গ-api-রাউটে-mongoose-এর-ব্যবহার)
3. [Redux Toolkit (RTK) আর্কিটেকচার গাইড](#৩-redux-toolkit-rtk-আর্কিটেকচার-গাইড)
   - [ক) Redux এর মূল ভিত্তি (Core Concepts)](#ক-redux-এর-মূল-ভিত্তি-core-concepts)
   - [খ) Store কনফিগারেশন (`lib/redux/store.ts`)](#খ-store-কনফিগারেশন-libreduxstorets)
   - [গ) Next.js App Router-এ StoreProvider (`lib/redux/StoreProvider.tsx`)](#গ-nextjs-app-router-এ-storeprovider)
   - [ঘ) কাস্টম হুকস (`lib/redux/hooks.ts`)](#ঘ-কাস্টম-হুকস-libreduxhooksts)
   - [ঙ) Redux Slice ও Async Thunk (`lib/redux/slices/expenseSlice.ts`)](#ঙ-redux-slice-ও-async-thunk)
4. [সম্পূর্ণ ডাটা ফ্লো (End-to-End Data Flow)](#৪-সম্পূর্ণ-ডাটা-ফ্লো-end-to-end-data-flow)
5. [নতুন কোনো ফিচার যোগ করার নিয়ম](#৫-নতুন-কোনো-ফিচার-যোগ-করার-নিয়ম-step-by-step)
6. [প্রজেক্টটি রান করার নিয়ম](#৬-প্রজেক্টটি-রান-করার-নিয়ম-how-to-run)

---

## ১. প্রজেক্টের ফোল্ডার স্ট্রাকচার (Folder Structure)

```text
├── app/                          # Next.js App Router পেজ ও ব্যাকএন্ড API
│   ├── api/                      # সার্ভারলেস ব্যাকএন্ড API এন্ডপয়েন্ট
│   │   ├── auth/                 # অথেনটিকেশন API (Better Auth)
│   │   └── expenses/             # খরচ ম্যানেজমেন্ট API
│   │       ├── route.ts          # GET (লিস্ট আনা), POST (নতুন যোগ)
│   │       └── [id]/route.ts     # PUT (এডিট), DELETE (মুছে ফেলা)
│   ├── layout.tsx                # রুট লেআউট (এখানে Redux StoreProvider কানেক্টেড)
│   ├── page.tsx                  # মেইন ড্যাশবোর্ড পেজ
│   ├── login/page.tsx            # লগইন পেজ
│   └── signup/page.tsx           # সাইনআপ পেজ
│
├── components/                   # রি-ইউজেবল UI কম্পোনেন্টস
│   ├── expenses/                 # Expense রিলেটেড UI (Form, List, Charts, Stats)
│   └── shared/                   # Navbar, ThemeToggle ইত্যাদি
│
├── lib/                          # হেল্পার ও লাইব্রেরি কনফিগারেশন
│   ├── auth.ts                   # সার্ভার-সাইড অথ কনফিগ
│   ├── auth-client.ts            # ক্লায়েন্ট-সাইড অথ হুকস
│   ├── categories.ts             # ক্যাটাগরি ও আইকন ডেফিনিশন
│   ├── mongoose.ts               # MongoDB কানেকশন ক্যাশিং লজিক
│   └── redux/                    # Redux Toolkit সেটআপ
│       ├── hooks.ts              # টাইপড useAppDispatch ও useAppSelector
│       ├── store.ts              # Redux Store কনফিগারেশন
│       ├── StoreProvider.tsx     # Client-side Store Provider র্যাপার
│       └── slices/               # রিডাক্স স্লাইসসমূহ
│           └── expenseSlice.ts   # খরচের স্টেট, রিডিউসার ও Async Thunk
│
├── models/                       # Mongoose ডাটাবেজ মডেল
│   └── Expense.ts                # Expense Schema ও Model ডেফিনিশন
│
└── .env.local                    # ডাটাবেজ URL ও সিক্রেট কী
```

---

## ২. Mongoose আর্কিটেকচার ও ডাটাবেজ গাইড

**Mongoose কী?**
Mongoose হলো Node.js এবং MongoDB এর মাঝে একটি Object Data Modeling (ODM) লাইব্রেরি। এটি জাভাস্ক্রিপ্ট অবজেক্ট দিয়ে ডাটাবেজ ডাটা স্ট্রাকচার (Schema) ও কুয়েরি তৈরি করতে সাহায্য করে।

### ক) ডাটাবেজ কানেকশন (`lib/mongoose.ts`)
Next.js সার্ভারলেস এনভায়রনমেন্টে প্রতিটা API রিকোয়েস্টে যাতে বারবার নতুন ডাটাবেজ কানেকশন তৈরি না হয়, সেজন্য কানেকশন **গ্লোবালি ক্যাশ (Global Cache)** করে রাখা হয়।

```typescript
// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI;

// ক্যাশ অবজেক্ট ডিক্লেয়ারেশন
let cached = global.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn; // অলরেডি কানেক্টেড থাকলে ফেরত দাও

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "proshikhok",
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

### খ) স্কিমা ও মডেল (`models/Expense.ts`)
ডাটাবেজে ডেটা কীভাবে সেভ হবে তার ব্লুপ্রিন্ট বা নিয়মাবলী তৈরি করা হয় Schema দিয়ে।

```typescript
// models/Expense.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// ১. TypeScript Interface (ডাটার টাইপ নির্ধারণের জন্য)
export interface IExpense {
  userId: string;
  userEmail?: string;
  title: string;
  amount: number;
  category: string;
  date: Date | string;
  notes?: string;
}

// ২. Mongoose Schema (MongoDB-র ফিল্ডের ভ্যালিডেশন)
const ExpenseSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, default: "" },
  },
  { timestamps: true } // এতে createdAt এবং updatedAt নিজে থেকেই তৈরি হয়
);

// ৩. Next.js Hot Reloading-এ মডেল ডুপ্লিকেশন আটকানোর প্যাটার্ন
const Expense: Model<IExpenseDocument> =
  mongoose.models.Expense || mongoose.model<IExpenseDocument>("Expense", ExpenseSchema);

export default Expense;
```

---

### গ) API রাউটে Mongoose এর ব্যবহার
Next.js এর API রুটগুলোতে Mongoose মডেল ব্যবহার করে ডেটাবেজ অপারেশন সম্পন্ন করা হয়:

* **ডাটা ফেচ করা (GET - `app/api/expenses/route.ts`):**
  ```typescript
  await connectToDatabase();
  const expenses = await Expense.find({ userId: session.user.id })
                                .sort({ date: -1 })
                                .lean();
  ```
* **নতুন ডাটা ইনসার্ট করা (POST - `app/api/expenses/route.ts`):**
  ```typescript
  await connectToDatabase();
  const newExpense = await Expense.create({
    userId: session.user.id,
    title,
    amount,
    category,
    date,
    notes
  });
  ```
* **ডাটা এডিট ও ডিলিট করা (`app/api/expenses/[id]/route.ts`):**
  ```typescript
  // এডিট
  await Expense.findOneAndUpdate({ _id: id, userId: session.user.id }, updateData, { new: true });

  // ডিলিট
  await Expense.findOneAndDelete({ _id: id, userId: session.user.id });
  ```

---

## ৩. Redux Toolkit (RTK) আর্কিটেকচার গাইড

**Redux কী?**
Redux হলো ফ্রন্টএন্ডের জন্য একটি সেন্ট্রাল স্টোরেজ (Global State Management)। যখন অ্যাপ্লিকেশনের একাধিক কম্পোনেন্টে একই ডেটা শেয়ার করতে হয় (যেমন: খরচের লিস্ট, চার্ট, স্ট্যাটিস্টিকস ও ফর্ম), তখন Redux ব্যবহার করা হয়।

### ক) Redux এর মূল ভিত্তি (Core Concepts)
1. **Store:** সম্পূর্ণ অ্যাপের সমস্ত গ্লোবাল ডাটার একমাত্র কেন্দ্রবিন্দু।
2. **State:** বর্তমান ডাটা (যেমন: খরচের তালিকা, লোডিং অবস্থা)।
3. **Action:** স্টেট পরিবর্তনের বার্তা (যেমন: `addExpense`, `deleteExpense`)।
4. **Reducer:** ফাংশন যা Action গ্রহণ করে এবং নতুন State রিটার্ন করে।
5. **Dispatch:** কম্পোনেন্ট থেকে Action ট্রিগার করার উপায় (`dispatch(fetchExpenses())`)।
6. **Selector:** Store থেকে নির্দিষ্ট ডাটা রিড বা সিলেক্ট করা (`useAppSelector(...)`)।

---

### খ) Store কনফিগারেশন (`lib/redux/store.ts`)
Next.js App Router-এ প্রতিটি রিকোয়েস্টে আইসোলেটেড স্টোর ইনস্ট্যান্স তৈরি করতে `makeStore` ফাংশন ব্যবহার করা হয়।

```typescript
// lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slices/expenseSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      expenses: expenseReducer, // একাধিক রিডিউসার এখানে যুক্ত হবে
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
```

---

### গ) Next.js App Router-এ StoreProvider
Next.js App Router মূলত Server Component ডিফল্টভাবে রান করে। তাই ক্লায়েন্ট সাইডে Redux Provider সেট করতে একটি ক্লায়েন্ট র্যাপার দরকার:

```tsx
// lib/redux/StoreProvider.tsx
"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(); // প্রথম রেন্ডারে স্টোর তৈরি হয়
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
```

এরপর `app/layout.tsx`-এ সম্পূর্ণ অ্যাপ্লিকেশনকে `<StoreProvider>` দিয়ে ঘিরে দেওয়া হয়েছে:

```tsx
// app/layout.tsx
<StoreProvider>
  <Navbar />
  <main>{children}</main>
</StoreProvider>
```

---

### ঘ) কাস্টম হুকস (`lib/redux/hooks.ts`)
TypeScript-এর অটো-কমপ্লিশন ও টাইপ-সেফটির জন্য ডিফল্ট `useDispatch` এবং `useSelector`-এর টাইপড ভার্সন তৈরি করা আছে:

```typescript
// lib/redux/hooks.ts
import { useDispatch, useSelector, useStore } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
```

---

### ঙ) Redux Slice ও Async Thunk (`lib/redux/slices/expenseSlice.ts`)

Slice-এ স্টেটের ইনিশিয়াল ভ্যালু, নরমাল সিঙ্ক রিডিউসার এবং এসিঙ্ক এপিআই কল (Async Thunk) হ্যান্ডেল করা হয়।

#### ১. Async Thunk (API কলের জন্য):
```typescript
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.error);
      return data.data; // এটি সরাসরি fulfilled অ্যাকশনে payload হিসেবে যাবে
    } catch (err) {
      return rejectWithValue("নেটওয়ার্ক সমস্যা");
    }
  }
);
```

#### ২. Slice এবং Reducers:
```typescript
export const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    status: "idle",       // 'idle' | 'loading' | 'succeeded' | 'failed'
    currentExpense: null, // এডিট করার সময় সিলেক্টেড খরচ
    filterCategory: "All",
    searchQuery: "",
  },
  reducers: {
    // সিঙ্ক অ্যাকশন
    setCurrentExpense: (state, action) => {
      state.currentExpense = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    // এসিঙ্ক থাঙ্কের তিনটি স্টেজ ম্যানেজ করা হয়
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});
```

---

## ৪. সম্পূর্ণ ডাটা ফ্লো (End-to-End Data Flow)

যখন ব্যবহারকারী একটি নতুন খরচের এন্ট্রি সাবমিট করেন, তখন পর্দার পেছনে নিচের ধাপগুলো সম্পন্ন হয়:

```text
[ব্যবহারকারী UI তে 'Add Expense' বাটনে ক্লিক করলেন]
                        │
                        ▼
[ExpenseForm কম্পোনেন্টে dispatch(addExpense(formData)) কল হলো]
                        │
                        ▼
[addExpense (Redux Async Thunk) ব্যাকএন্ডে POST রিকোয়েস্ট পাঠালো]
                        │
                        ▼
[Next.js API Route (/api/expenses) রিকোয়েস্ট গ্রহণ করলো]
                        │
                        ▼
[Mongoose connectToDatabase() হয়ে Expense.create() এর মাধ্যমে MongoDB-তে সেভ করলো]
                        │
                        ▼
[API থেকে রেসপন্স JSON আকারে ফেরত আসলো (Status: 200/201)]
                        │
                        ▼
[Redux Slice-এর extraReducers-এ addExpense.fulfilled এক্সিকিউট হলো]
  ──> state.items.unshift(newExpense) দিয়ে স্টেট আপডেট হলো
                        │
                        ▼
[ExpenseList, ExpenseStats ও ExpenseCharts স্বয়ংক্রিয়ভাবে Re-render হয়ে নতুন ডাটা দেখালো]
```

---

## ৫. নতুন কোনো ফিচার যোগ করার নিয়ম (Step-by-Step)

ধরা যাক, আপনি প্রজেক্টে **"Budget Goals"** (বাজেট লক্ষ্যমাত্রা) ফিচার যোগ করতে চান:

1. **Step 1 (Mongoose Model):** `models/Budget.ts` তৈরি করুন এবং স্কিমা ডিফাইন করুন।
2. **Step 2 (API Route):** `app/api/budgets/route.ts` তৈরি করুন (GET, POST ইত্যাদি হ্যান্ডেল করার জন্য)।
3. **Step 3 (Redux Slice):** `lib/redux/slices/budgetSlice.ts` তৈরি করুন এবং তাতে `fetchBudgets`, `addBudget` থাঙ্ক ও রিডিউসার ডিফাইন করুন।
4. **Step 4 (Store-এ যুক্তকরণ):** `lib/redux/store.ts`-এর `reducer` অবজেক্টে `budget: budgetReducer` যুক্ত করুন।
5. **Step 5 (UI Component):** কম্পোনেন্টে `useAppDispatch` ও `useAppSelector` দিয়ে ডাটা রিড ও অ্যাকশন ডিসপ্যাচ করুন।

---

## ৬. প্রজেক্টটি রান করার নিয়ম (How to Run)

### ১. পরিবেশ ভেরিয়েবল সেটআপ (`.env.local`):
প্রজেক্টের রুটে `.env.local` ফাইল তৈরি করে নিচের ভ্যালুগুলো দিন:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/proshikhok
BETTER_AUTH_SECRET=your_super_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
```

### ২. ডিপেন্ডেন্সি ইনস্টল ও রান:
```bash
# প্যাকেজ ইনস্টল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```

ব্রাউজারে [http://localhost:3000](http://localhost:3000) ওপেন করলেই সম্পূর্ণ অ্যাপটি দেখতে পাবেন।
