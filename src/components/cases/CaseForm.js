"use client";

import React, { useState, useEffect } from "react";
import MultiSelect from "@/components/ui/MultiSelect";
import useApiUsers from "@/hooks/users/useApiUsers";
import useApiTags from "@/hooks/clients/useApiTags";
import useApiClients from "@/hooks/clients/useApiClients";
import useApiStatuses from "@/hooks/cases/seApiCaseStatuses";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import StatusSelect from "@/components/ui/StatusSelect";
import Button from "@/components/ui/Button";
import submitCaseForm from '@/services/cases/submitCaseForm';
import Image from 'next/image';


const initialForm = {
  case_number: "",
  title: "",
  description: "",
  progress: 0,
  start_date: "",
  end_date: "",
  client_id: "",
  case_status_id: "",
  tags: [],
  lawyers: [],
};

export default function CaseForm({ onClose, setCases, caseData, onSaved }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { users } = useApiUsers();
  const { clients } = useApiClients();
  const { tags: tagsOptions, loading: loadingTags } = useApiTags();
  const { statuses } = useApiStatuses();
  const [formErrors, setFormErrors] = useState({});


  useEffect(() => {
    if (caseData) {
      setFormData({
        ...initialForm,
        ...caseData,
        client_id: caseData.client?.id || "",
        case_status_id: caseData.status?.id || "",
        tags: caseData.tags?.map((tag) => tag.id) || [],
        lawyers: caseData.lawyers?.map((lawyer) => lawyer.id) || [],
      });
    }
  }, [caseData]);


  const handleSubmit = (e) => {
    e.preventDefault();
    submitCaseForm({
      caseData,
      formData,
      setCases,
      onSaved,
      onClose,
      resetForm: () => setFormData(initialForm),
      setLoading,
      setSuccess,
      setFormErrors,
    });
  };


  const lawyerOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
    avatar: `https://i.pravatar.cc/40?u=${user.id}`,
  }));

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: `${client.name} ${client.last_name}`,
  }));

  const statusOptions = statuses.map((status) => ({
    value: status.id,
    label: status.label,
    color: status.color,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected, name) => {
    const values = selected ? selected.map((item) => item.value) : [];
    setFormData((prev) => ({ ...prev, [name]: values }));
  };


  // === UI Custom Components ===
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
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }}></span>
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
        className="rounded-full"
        unoptimized
      />
      }
      <span>{data.label}</span>
    </div>
  );

  const customSingleValue = ({ data }) => (
    <div className="flex items-center gap-2">
      {data.avatar && <Image
        src={data.avatar}
        alt={data.label}
        width={24}
        height={24}
        className="rounded-full"
        unoptimized
      />
      }
      <span>{data.label}</span>
    </div>
  );

  const customStatusOption = ({ data, innerRef, innerProps }) => (
    <div ref={innerRef} {...innerProps} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></span>
      <span>{data.label}</span>
    </div>
  );

  const customStatusSingleValue = ({ data }) => (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></span>
      <span>{data.label}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto  rounded-lg border border-gray-200 bg-white p-8">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">N° Project:</label>
          <div className="flex items-center">
            <span className="px-2 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l text-gray-500">
              EXP-
            </span>
            <Input
              name="case_number"
              value={formData.case_number.replace(/^EXP-/, '')}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                setFormData((prev) => ({
                  ...prev,
                  case_number: `EXP-${numericValue}`
                }));
              }}
              placeholder="00123"
              type="text"
              className="rounded-l-none"
              required
            />
          </div>
        </div>


        <Input
          label="Title:"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título"
          className="border p-2 rounded w-full"
        />
        <Textarea
          label="Description:"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción del proyecto"
          className="border p-2 rounded w-full"
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Start date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <Input
            label="End date"
            name="end_date"
            type="date"
            value={formData.end_date || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <MultiSelect
          label="Customer"
          value={clientOptions.find((c) => c.value === formData.client_id)}
          options={clientOptions}
          onChange={(selected) => setFormData((prev) => ({ ...prev, client_id: selected?.value || "" }))}
          placeholder="Select customer..."
          isMulti={false}
        />

        <StatusSelect
          label="Status"
          value={formData.case_status_id}
          onChange={e => handleChange({ target: { name: "case_status_id", value: e.target.value } })}
          options={statusOptions}
          isLoading={!statusOptions.length}
        />


        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
          <MultiSelect
            value={tagsOptions.filter((tag) => formData.tags.includes(tag.value))}
            options={tagsOptions}
            onChange={(selected) => handleSelectChange(selected, "tags")}
            placeholder={loadingTags ? "Loading tags..." : "Select tags..."}
            isLoading={loadingTags}
            components={{
              Option: customTagOption,
              SingleValue: customTagSingleValue,
              MultiValueLabel: customTagMultiValue,
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Assign user</label>
          <MultiSelect
            value={lawyerOptions.filter((lawyer) => formData.lawyers.includes(lawyer.value))}
            options={lawyerOptions}
            onChange={(selected) => handleSelectChange(selected, "lawyers")}
            placeholder="Select user..."
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
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            size="md"
            variant="primary"
          >
            {loading ? "Saving..." : "Save project"}
          </Button>
        </div>

      </form>
    </div>
  );
}
