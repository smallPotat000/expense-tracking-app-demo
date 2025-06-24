import { connectToDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  await connectToDB();
  const categories = await Category.find();
  const allEnabled = categories.length > 0 && categories.every((c) => c.enabled);
  return new Response(JSON.stringify({ categories, allEnabled }), { status: 200 });
}

export async function POST(req) {
  await connectToDB();
  const { categories } = await req.json();

  await Category.deleteMany({});
  await Category.insertMany(categories);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
