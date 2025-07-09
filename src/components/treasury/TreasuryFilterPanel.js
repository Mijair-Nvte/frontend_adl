'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import MultiSelect from '@/components/ui/MultiSelect';

export default function TreasuryFilterPanel({ onApply, onClose }) {
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('treasuryFilters');
    return saved
      ? JSON.parse(saved)
      : {
          client_id: '',
          case_id: '',
          treasury_category_id: '',
          treasury_payment_method_id: '', type: ''
        };
  });

  const [clientOptions, setClientOptions] = useState([]);
  const [caseOptions, setCaseOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/treasury`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setClientOptions(
          data.clients.map((c) => ({
            value: c.id,
            label: `${c.name} ${c.last_name}`,
          }))
        );
        setCaseOptions(
          data.cases.map((c) => ({ value: c.id, label: c.title }))
        );
        setCategoryOptions(
          data.categories.map((c) => ({ value: c.id, label: c.name }))
        );
        setPaymentMethodOptions(
          data.payment_methods.map((p) => ({
            value: p.id,
            label: p.name,
          }))
        );
      });
  }, []);

  const handleApply = () => {
    localStorage.setItem('treasuryFilters', JSON.stringify(filters));
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    onApply(params);
    if (onClose) onClose();
  };

  const handleReset = () => {
    const reset = {
      client_id: '',
      case_id: '',
      treasury_category_id: '',
      treasury_payment_method_id: '',
    };
    setFilters(reset);
    localStorage.removeItem('treasuryFilters');
    onApply({});
    if (onClose) onClose();
  };

  return (
    <div className="space-y-4">

        <MultiSelect
  label="Tipo de movimiento"
  name="type"
  options={[
    { value: 'income', label: 'Ingreso' },
    { value: 'expense', label: 'Egreso' }
  ]}
  value={[
    { value: 'income', label: 'Ingreso' },
    { value: 'expense', label: 'Egreso' }
  ].find(opt => opt.value === filters.type) || null}
  onChange={(opt) => setFilters(prev => ({ ...prev, type: opt?.value || '' }))}
  isMulti={false}
/>


      <MultiSelect
        label="Cliente"
        name="client_id"
        options={clientOptions}
        value={clientOptions.find((opt) => opt.value === filters.client_id) || null}
        onChange={(opt) => setFilters((prev) => ({ ...prev, client_id: opt?.value || '' }))}
        isMulti={false}
      />

      <MultiSelect
        label="Proyecto"
        name="case_id"
        options={caseOptions}
        value={caseOptions.find((opt) => opt.value === filters.case_id) || null}
        onChange={(opt) => setFilters((prev) => ({ ...prev, case_id: opt?.value || '' }))}
        isMulti={false}
      />

      <MultiSelect
        label="Categoría"
        name="treasury_category_id"
        options={categoryOptions}
        value={categoryOptions.find((opt) => opt.value === filters.treasury_category_id) || null}
        onChange={(opt) => setFilters((prev) => ({ ...prev, treasury_category_id: opt?.value || '' }))}
        isMulti={false}
      />

      <MultiSelect
        label="Método de Pago"
        name="treasury_payment_method_id"
        options={paymentMethodOptions}
        value={paymentMethodOptions.find((opt) => opt.value === filters.treasury_payment_method_id) || null}
        onChange={(opt) => setFilters((prev) => ({ ...prev, treasury_payment_method_id: opt?.value || '' }))}
        isMulti={false}
      />

      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={handleReset}>
          Restaurar
        </Button>
        <Button onClick={handleApply}>Aplicar</Button>
      </div>
    </div>
  );
}
