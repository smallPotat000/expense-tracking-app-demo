import { connectToDB } from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function GET() {
  await connectToDB();
  const expenses = await Expense.find();
  return new Response(JSON.stringify(expenses), { status: 200 });
}

export async function POST(req) {
  await connectToDB();
  const { itemName, category, amount, date } = await req.json();

  const expense = new Expense({
    itemName,
    category,
    amount,
    date: date ? new Date(date) : new Date(),
  });

  await expense.save();
  return new Response(JSON.stringify(expense), { status: 201 });
}

export async function PUT(req) {
  await connectToDB();
  const { id, itemName, category, amount, date } = await req.json();

  const updated = await Expense.findByIdAndUpdate(id, {
    itemName,
    category,
    amount,
    date: date ? new Date(date) : new Date(),
  });

  if (!updated) {
    return new Response(JSON.stringify({ error: 'Expense not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: 'Expense updated' }), { status: 200 });
}


export async function DELETE(req) {
  await connectToDB();
  const { id } = await req.json();

  const deleted = await Expense.findByIdAndDelete(id);

  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Expense not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 });
}
