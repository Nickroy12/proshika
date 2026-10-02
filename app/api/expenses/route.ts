import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Expense from "@/models/Expense";
import { auth } from "@/lib/auth";

// GET /api/expenses - Fetch expenses only for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to view your expenses." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "date-desc";

    // Strictly scope query to the authenticated user's ID
    const query: Record<string, unknown> = {
      $or: [
        { userId: session.user.id },
        { userEmail: session.user.email },
      ],
    };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$and = [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { notes: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { date: -1 };
    if (sort === "date-asc") sortOption = { date: 1 };
    else if (sort === "amount-desc") sortOption = { amount: -1 };
    else if (sort === "amount-asc") sortOption = { amount: 1 };
    else if (sort === "date-desc") sortOption = { date: -1 };

    const expenses = await Expense.find(query).sort(sortOption).lean();

    return NextResponse.json(
      {
        success: true,
        count: expenses.length,
        data: expenses,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/expenses error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch expenses";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create new expense for the logged-in user
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to add expenses." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { title, amount, category, date, notes } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid amount greater than 0" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category is required" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date is required" },
        { status: 400 }
      );
    }

    const newExpense = await Expense.create({
      userId: session.user.id,
      userEmail: session.user.email || "",
      title: title.trim(),
      amount: Number(amount),
      category,
      date: new Date(date),
      notes: notes ? notes.trim() : "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Expense created successfully",
        data: newExpense,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/expenses error:", error);
    const message = error instanceof Error ? error.message : "Failed to create expense";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
