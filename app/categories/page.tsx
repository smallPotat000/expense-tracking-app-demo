'use client';

import { useEffect, useState } from 'react';

type Category = {
  name: string;
  monthlyBudget: number;
  enabled: boolean;
};

export default function ManageBudgetsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allEnabled, setAllEnabled] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setAllEnabled(data.allEnabled);
      });
  }, []);

  const handleCategoryChange = (index: number, key: keyof Category, value: any) => {
    const updated = [...categories];
    updated[index][key] = value;
    setCategories(updated);

    // Sync master toggle
    const everyEnabled = updated.every((c) => c.enabled);
    const noneEnabled = updated.every((c) => !c.enabled);
    setAllEnabled(everyEnabled ? true : noneEnabled ? false : false);
  };

  const handleAllToggle = () => {
    const nextEnabled = !allEnabled;
    setAllEnabled(nextEnabled);
    setCategories(categories.map((c) => ({ ...c, enabled: nextEnabled })));
  };

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { name: '', monthlyBudget: 50, enabled: true, budgetThreshold: 80 },
    ]);
  };

  const handleDeleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ categories }),
    });
    alert('Saved!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-3">
        <input
          type="checkbox"
          className="scale-125"
          checked={allEnabled}
          onChange={handleAllToggle}
        />
        Manage Monthly Budgets
      </h1>

      <table className="w-full border rounded overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-center">Enabled</th>
            <th className="p-2">Category</th>
            <th className="p-2">Budget</th>
            <th className="p-2">Warn At (%)</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={cat.enabled}
                  onChange={(e) =>
                    handleCategoryChange(i, 'enabled', e.target.checked)
                  }
                />
              </td>
              <td className="p-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  value={cat.name}
                  onChange={(e) => handleCategoryChange(i, 'name', e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  type="number"
                  value={cat.monthlyBudget}
                  onChange={(e) =>
                    handleCategoryChange(i, 'monthlyBudget', parseInt(e.target.value))
                  }
                />
              </td>
              <td className="p-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  type="number"
                  min={0}
                  max={100}
                  value={cat.budgetThreshold ?? 80}
                  onChange={(e) =>
                    handleCategoryChange(i, 'budgetThreshold', parseInt(e.target.value))
                  }
                />
              </td>

              <td className="p-2 text-center">
                <button
                  onClick={() => handleDeleteCategory(i)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-3">
        <button onClick={handleAddCategory} className="bg-gray-200 px-3 py-1 rounded">
          ➕ Add Category
        </button>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1 rounded">
          Save
        </button>
      </div>
    </div>
  );
}
