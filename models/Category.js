import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: String,
  monthlyBudget: Number,
  enabled: { type: Boolean, default: true },
  budgetThreshold: { type: Number, default: 80 },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
