'use client';

import { useState } from 'react';
import useCategories from '../hooks/useCategories';

export default function ExpenseForm() {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const categories = useCategories();

  const handleSubmit = async () => {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ itemName, category, amount, date }),
    });

    if (res.ok) {
      setItemName('');
      setCategory('');
      setAmount('');
      setDate('');
      window.location.reload(); // or call mutate() if using SWR
    } else {
      alert('Failed to add expense');
    }
  };

  return (
    <div className="section-box">
      <input className="input-box" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item" />
      <select className="input-box" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option className="input-box" value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <input className="input-box" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      <input className="input-box" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button className="button" onClick={handleSubmit}>Add</button>
    </div>
  );
}
