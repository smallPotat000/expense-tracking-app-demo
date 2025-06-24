import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  itemName: String,
  category: String, // ✅ Now dynamic, no enum
  amount: Number,
  date: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
