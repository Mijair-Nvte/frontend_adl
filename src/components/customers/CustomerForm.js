'use client';

import React, { useState, useEffect } from "react";
import StatusSelect from "@/components/ui/StatusSelect";
import MultiSelect from "@/components/ui/MultiSelect";
import Input from "@/components/ui/Input";
import { UserIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import useApiUsers from "@/hooks/users/useApiUsers";
import useApiTags from "@/hooks/clients/useApiTags";
import submitCustomerForm from '@/services/clients/submitCustomerForm';
import useApiClienteStatuses from "@/hooks/clients/useApiClienteStatuses";
import Textarea from "../ui/Textarea";
import Button from "@/components/ui/Button";
import Image from 'next/image';

const initialForm = {
  type: "persona",
  name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  estado: "",
  descriptions: "",
  status: "active",
  tags: [],
  lawyers: [],
  group_id: null,
};

export default function CustomerForm({ onClose, setClients, client, onSaved }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { users } = useApiUsers();
  const { tags: tagsOptions, loading: loadingTags } = useApiTags();
  const { statuses: statusOptions } = useApiClienteStatuses();

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        tags: client.tags?.map((tag) => tag.id) || [],
        lawyers: client.lawyers?.map((lawyer) => lawyer.id) || [],
        client_status_id: client.client_status?.id || null,
        group_id: client.group?.id || null,

      });
    }
  }, [client]);


  const lawyerOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
    avatar: `https://i.pravatar.cc/40?u=${user.id}`,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected, name) => {
    const values = selected ? selected.map((item) => item.value) : [];
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitCustomerForm({
      client,
      formData,
      setClients,
      onSaved,
      onClose,
      resetForm: () => setFormData(initialForm),
      setLoading,
      setSuccess,
    });
  };

  const customSingleValue = ({ data }) => (
    <div className="flex items-center gap-2">
      {data.avatar && <Image
        src={data.avatar}
        alt={data.label}
        width={20}
        height={20}
        className="rounded-full w-5 h-5"
      />
      }
      <span>{data.label}</span>
    </div>
  );

  const customOption = ({ data, innerRef, innerProps }) => (
    <div ref={innerRef} {...innerProps} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
      {data.avatar && <Image
        src={data.avatar}
        alt={data.label}
        width={24}
        height={24}
        className="rounded-full w-6 h-6"
      />
      }
      <span>{data.label}</span>
    </div>
  );

  const customTagOption = ({ data, innerRef, innerProps }) => (
    <div ref={innerRef} {...innerProps} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></span>
      <span>{data.label}</span>
    </div>
  );

  const customTagSingleValue = ({ data }) => (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></span>
      <span>{data.label}</span>
    </div>
  );

  const customTagMultiValue = ({ data }) => (
    <div className="flex items-center gap-1">
      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.color }}></span>
      <span>{data.label}</span>
    </div>
  );


  return (
    <div className="max-w-4xl mx-auto  rounded-lg border border-gray-200 bg-white p-8">


      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          {[{
            label: "Persona",
            value: "persona",
            description: "Registro para cliente individual",
            icon: <UserIcon className="w-5 h-5" />,
          }, {
            label: "Organización",
            value: "organizacion",
            description: "Registro para empresa u organización",
            icon: <BuildingOffice2Icon className="w-5 h-5" />,
          }].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, type: item.value }))}
              className={`w-full text-left border rounded-lg p-4 transition hover:border-indigo-500 ${formData.type === item.value ? "border-green-500 text-green-700 ring-1 ring-green-300" : "border-gray-300 text-gray-600"}`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                {item.icon}
                {item.label}
              </div>
              <div className="text-xs mt-1">{item.description}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="name" label="Nombre" value={formData.name} onChange={handleChange} placeholder="Nombre" />
          <Input name="last_name" label="Apellido" value={formData.last_name} onChange={handleChange} placeholder="Apellido" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="email" label="Correo electrónico" type="email" value={formData.email} onChange={handleChange} placeholder="Correo electrónico" />
          <Input name="phone" label="Teléfono" value={formData.phone} onChange={handleChange} placeholder="Teléfono" required />
        </div>

        <Input name="address" label="Dirección" value={formData.address} onChange={handleChange} placeholder="Dirección" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="estado" label="Estado" value={formData.estado} onChange={handleChange} placeholder="Estado" />

          <StatusSelect
            label="Estatus"
            value={formData.client_status_id}
            onChange={(e) => handleChange({ target: { name: "client_status_id", value: e.target.value } })}
            options={statusOptions.map((s) => ({
              value: s.id,
              label: s.label,
              color: s.color,
            }))}
            isLoading={!statusOptions.length}
          />


        </div>

        <div>
          <Textarea
            name="descriptions"
            label="Descripción"
            value={formData.descriptions}
            onChange={handleChange}
            placeholder="Descripción"
            rows={4}
          />

        </div>

        <div>

          <MultiSelect
            label="Etiquetas"
            value={tagsOptions.filter((tag) => formData.tags.includes(tag.value))}
            options={tagsOptions}
            onChange={(selected) => handleSelectChange(selected, "tags")}
            placeholder={loadingTags ? "Cargando etiquetas..." : "Selecciona etiquetas..."}
            isLoading={loadingTags}
            components={{
              Option: customTagOption,
              SingleValue: customTagSingleValue,
              MultiValueLabel: customTagMultiValue,
            }}
          />

        </div>

        <div>

          <MultiSelect
            label="Asignar"
            value={lawyerOptions.filter((lawyer) => formData.lawyers.includes(lawyer.value))}
            options={lawyerOptions}
            onChange={(selected) => handleSelectChange(selected, "lawyers")}
            placeholder="Selecciona usuarios..."
            isMulti
            components={{ Option: customOption, SingleValue: customSingleValue }}
          />

        </div>

        <div className="flex justify-end gap-4 pt-6 border-t mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            size="md"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            size="md"
            variant="primary"
          >
            {loading ? "Guardando..." : "Guardar Cliente"}
          </Button>
        </div>
      </form>



    </div>
  );
}
