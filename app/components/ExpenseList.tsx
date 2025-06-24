'use client';

import { useState } from 'react';
import useCategories from '../hooks/useCategories';

function isSameMonth(dateString: string) {
  const now = new Date();
  const d = new Date(dateString);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function ExpenseList({ initialExpenses }: { initialExpenses: any[] }) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const categories = useCategories();

  const categorySum = (catName: string) =>
    expenses
      .filter((e) => e.category === catName && isSameMonth(e.date))
      .reduce((sum, e) => sum + Number(e.amount), 0);

  // handlers: handleEdit, handleDelete, saveEdit
  const handleEdit = (id: string, field: string, value: any) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e._id === id ? { ...e, [field]: field === 'amount' ? Number(value) : value } : e
      )
    );
  };

  const saveEdit = async (expense: any) => {
    const res = await fetch('/api/expenses', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: expense._id,
        itemName: expense.itemName,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
      }),
    });

    if (!res.ok) {
      alert('Failed to update');
    }
  };


  const handleDelete = async (id: string) => {
    const res = await fetch('/api/expenses', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } else {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      <section>
        <h2 className="text-xl font-bold mb-2">Monthly Overview</h2>

        {categories.map((cat) => {
          const name = cat.name;
          const total = categorySum(name);

          return (
            <div key={name} className="mb-4 border p-3 rounded bg-gray-50">
              <h3 className="font-bold">{name}</h3>
              <p>Total this month: ${total}</p>

              {cat.enabled ? (
                <>
                  {total > cat.monthlyBudget && (
                    <>
                      <p className="text-red-500">
                        ⚠ Budget exceeded! Limit: ${cat.monthlyBudget}, where your spending ${total} this month
                      </p>
                    </>
                  )}

                  {total > (cat.monthlyBudget * (cat.budgetThreshold / 100)) &&
                    total <= cat.monthlyBudget && (
                      <>
                        <p className="text-yellow-500">
                          ⚠ Over budget ({cat.budgetThreshold}% of ${cat.monthlyBudget}), where you already spent ${total} this month 
                        </p>
                      </>
                    )}
                </>
              ) : (
                <p className="text-gray-500 text-sm italic">Budget tracking disabled</p>
              )}

              <ul className="list-disc ml-5">
                {expenses
                  .filter((e) => e.category === name && isSameMonth(e.date))
                  .map((e) => (
                    <li key={e._id}>
                      {e.itemName} - ${e.amount} ({e.date?.slice(0, 10)})
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </section>
      <br></br>
      <hr className="solid"></hr>
      <br></br>
      {/* Editable Record Table (Chronological) */}
      <section>
        <h2 className="text-xl font-bold">All Records (Chronological)</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...expenses]
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((e) => (
                <tr key={e._id}>
                  <td className="p-2 border">
                    <input
                      type="date"
                      value={e.date?.slice(0, 10)}
                      onChange={(ev) => handleEdit(e._id, 'date', ev.target.value)}
                      className="w-full"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="text"
                      value={e.itemName}
                      onChange={(ev) => handleEdit(e._id, 'itemName', ev.target.value)}
                      className="w-full"
                    />
                  </td>

                  <td className="p-2 border">
                    <select
                      value={e.category}
                      onChange={(ev) => handleEdit(e._id, 'category', ev.target.value)}
                      className="w-full"
                    >
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-2 border">
                    <input
                      type="number"
                      value={e.amount}
                      onChange={(ev) => handleEdit(e._id, 'amount', ev.target.value)}
                      className="w-full"
                    />
                  </td>

                  <td className="p-2 border text-center">
                    <button onClick={() => saveEdit(e)} className="text-green-600">Save</button>
                    <button onClick={() => handleDelete(e._id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}