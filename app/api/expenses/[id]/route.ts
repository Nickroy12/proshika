import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Expense from "@/models/Expense";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/expenses/[id] - Get single expense for authenticated owner
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const expense = await Expense.findOne({
      _id: id,
      $or: [{ userId: session.user.id }, { userEmail: session.user.email }],
    }).lean();

    if (!expense) {
      return NextResponse.json(
        { success: false, error: "Expense not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: expense },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/expenses/[id] error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch expense";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/[id] - Update expense for authenticated owner
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, amount, category, date, notes } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (amount !== undefined) {
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        return NextResponse.json(
          { success: false, error: "Amount must be a positive number" },
          { status: 400 }
        );
      }
      updateData.amount = Number(amount);
    }
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = new Date(date);
    if (notes !== undefined) updateData.notes = notes.trim();

    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: id,
        $or: [{ userId: session.user.id }, { userEmail: session.user.email }],
      },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedExpense) {
      return NextResponse.json(
        { success: false, error: "Expense not found or unauthorized to edit" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Expense updated successfully",
        data: updatedExpense,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PUT /api/expenses/[id] error:", error);
    const message = error instanceof Error ? error.message : "Failed to update expense";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Delete expense for authenticated owner
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      $or: [{ userId: session.user.id }, { userEmail: session.user.email }],
    }).lean();

    if (!deletedExpense) {
      return NextResponse.json(
        { success: false, error: "Expense not found or unauthorized to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Expense deleted successfully",
        data: deletedExpense,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/expenses/[id] error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete expense";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
