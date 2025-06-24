'use client';

import { useEffect, useState } from 'react';

export default function useCategories() {
  const [categories, setCategories] = useState<{ name: string; monthlyBudget: number; disabled: boolean }[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      });
  }, []);

  return categories;
}
