"use client";

import React, { useState } from "react";
import { Plus, Filter, Tag, BarChart2 } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Search } from "lucide-react";
import Input from "@/components/ui/Input";
import FilterDropdown from '@/components/ui/FilterDropdown';
import CaseFilterPanel from './CaseFilterPanel';

export default function CaseHeader({ onCreate, onSearch,onFilter  }) {

  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Panel/ Projects"
        actions={[
        <form onSubmit={handleSubmit} className="hidden md:flex items-center gap-2" key="search">
          <Input
            type="text"
            placeholder="Buscar projects o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <IconButton icon={Search} title="Buscar" />
        </form>,
        <FilterDropdown key="filter">
          <CaseFilterPanel onApply={(filters) => {
            onFilter(filters);
          }} />
        </FilterDropdown>,
      ]}
      >
        {/* Botón principal a la derecha */}
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onCreate}
        >
          New Projects
        </Button>
      </PageHeader>
    </>

  );
}
