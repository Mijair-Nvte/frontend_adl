// components/customers/CustomerFilterPanel.jsx
'use client';

import { useEffect, useState } from 'react';
import MultiSelect from '@/components/ui/MultiSelect';
import Button from '@/components/ui/Button';

export default function CustomerFilterPanel({ onApply }) {
  const [statuses, setStatuses] = useState([]);
  const [filters, setFilters] = useState({
    status_id: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setStatuses(data.statuses.map(s => ({
          value: s.id,
          label: s.label,
          color: s.color,
        })));
      });
  }, []);

  const handleApply = () => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    onApply(params);
  };

  return (
    <div className="space-y-4">
      <MultiSelect
        label="Estado del cliente"
        name="status_id"
        options={statuses}
        value={statuses.find(opt => opt.value === filters.status_id) || null}
        onChange={(opt) =>
          setFilters(prev => ({ ...prev, status_id: opt?.value || '' }))
        }
        isMulti={false}
      />

      <div className="flex justify-between pt-2">
        <Button
          variant="secondary"
          onClick={() => {
            const reset = { status_id: '' };
            setFilters(reset);
            onApply({});
          }}
        >
          Restaurar
        </Button>
        <Button onClick={handleApply}>Aplicar</Button>
      </div>
    </div>
  );
}
