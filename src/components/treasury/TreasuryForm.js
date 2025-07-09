"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import submitTreasuryForm from "@/services/treasury/submitTreasuryForm";
import CustomSelect from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

// 👇 Importa el hook por ID (solo cuando se edita)
import useApiTreasuryMovementById from "@/hooks/treasury/useApiTreasuryMovementById";

const initialForm = {
  type: "income",
  amount: "",
  concept: "",
  descriptions: "",
  treasury_payment_method_id: "",
  transaction_date: "",
  client_id: "",
  case_id: "",
  treasury_category_id: "",
};

export default function TreasuryForm({
  onClose,
  setMovements,
  movementId, // Pasa el id del movimiento cuando edites
  fetchMovements,
  // Estos solo se usan para crear (cuando no hay movementId)
  clients: propClients = [],
  cases: propCases = [],
  loadingClients,
  loadingCases,
  categories: propCategories = [],
  paymentMethods: propPaymentMethods = [],
  loadingCategories,
  loadingPaymentMethods,
}) {
  // Si se edita, trae todo desde el hook por ID
const {
  movement,
  clients: apiClients,
  cases: apiCases,
  categories: apiCategories,
  payment_methods: apiPaymentMethods,
  loading: loadingShow,
} = useApiTreasuryMovementById(movementId);

const clients = movementId ? apiClients : propClients;
const cases = movementId ? apiCases : propCases;
const categories = movementId ? apiCategories : propCategories;
const payment_methods = movementId ? apiPaymentMethods : propPaymentMethods;

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Cuando se está editando y ya llegan los datos
  useEffect(() => {
    if (movement) {
      setFormData({
        ...initialForm,
        ...movement,
        treasury_payment_method_id: movement.treasury_payment_method_id ?? movement.payment_method?.id ?? "",
        treasury_category_id: movement.treasury_category_id ?? movement.category?.id ?? "",
        client_id: movement.client_id ?? movement.client?.id ?? "",
        case_id: movement.case_id ?? movement.case?.id ?? "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [movement, movementId]);

  // Cuando se cambia el tipo de movimiento, resetea categoría
  useEffect(() => {
    setFormData((prev) => ({ ...prev, treasury_category_id: "" }));
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTreasuryForm({
      movement: movement || null, // null para crear, objeto para editar
      formData,
      setMovements,
      fetchMovements,
      onClose,
      resetForm: () => setFormData(initialForm),
      setLoading,
      setSuccess,
    });
  };

  // Opciones para los selects
  const paymentMethodOptions = (payment_methods || propPaymentMethods).map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const categoryOptions = (categories || propCategories).map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const clientOptions = (clients || propClients).map((c) => ({
    value: c.id,
    label: `${c.name ?? ""} ${c.last_name ?? ""}`,
  }));

  const caseOptions = (cases || propCases).map((c) => ({
    value: c.id,
    label: c.title,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Tipo de movimiento */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
          className={`w-full border rounded-lg p-4 ${formData.type === "income" ? "border-green-500 text-green-700 ring-1 ring-green-300" : "border-gray-300 text-gray-600"}`}
        >
          Ingreso
        </button>
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, type: "expense" }))}
          className={`w-full border rounded-lg p-4 ${formData.type === "expense" ? "border-red-500 text-red-700 ring-1 ring-red-300" : "border-gray-300 text-gray-600"}`}
        >
          Egreso
        </button>
      </div>

      <Input name="amount" label="Monto" value={formData.amount} onChange={handleChange} placeholder="Monto" type="number" step="0.01" />
      <Input name="concept" label="Concepto" value={formData.concept} onChange={handleChange} placeholder="Concepto" />

      <div>
       
         <Textarea
        name="descriptions"
        label="Descripción"
        value={formData.descriptions}
        onChange={handleChange}
        placeholder="Añade una descripción breve del movimiento"
        rows={3}
      />
      </div>

      {/* Métodos de pago */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Método de pago</label>
        <CustomSelect
          name="treasury_payment_method_id"
          value={formData.treasury_payment_method_id || ""}
          onChange={handleChange}
          options={paymentMethodOptions}
          placeholder="Selecciona un método"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Categoría</label>
        <CustomSelect
          name="treasury_category_id"
          value={formData.treasury_category_id || ""}
          onChange={handleChange}
          options={categoryOptions}
          placeholder="Selecciona una categoría"
        />
      </div>

      <Input name="transaction_date" label="Fecha" type="date" value={formData.transaction_date} onChange={handleChange} />

      {/* Cliente y Caso */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Cliente</label>
          <select
            name="client_id"
            value={formData.client_id || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Selecciona un cliente</option>
            {clientOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Proyecto</label>
          <select
            name="case_id"
            value={formData.case_id || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Selecciona un proyecto</option>
            {caseOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-4 pt-6 border-t mt-8">
        <button onClick={onClose} type="button" className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">Cancelar</button>
        <button type="submit" disabled={loading || loadingShow} className="px-6 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          {(loading || loadingShow) ? "Guardando..." : "Guardar Movimiento"}
        </button>
      </div>
      {success && <p className="text-green-600 text-sm mt-4">✅ Movimiento guardado correctamente.</p>}
    </form>
  );
}
