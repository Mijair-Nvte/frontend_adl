"use client";

import React from "react";
import { Plus, Filter, BarChart2, LayoutList, LayoutPanelTop } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import PageHeader from "@/components/ui/PageHeader";

export default function TasksHeader({ onCreate, viewMode, setViewMode }) {
  return (
    <PageHeader
      title="Tareas"
      subtitle={`Panel / ${viewMode === "kanban" ? "Kanban" : "Lista"}`}
      actions={[
        // Cambiar vista
        <IconButton
          icon={viewMode === "kanban" ? LayoutList : LayoutPanelTop}
          title="Cambiar vista"
          onClick={() => setViewMode(viewMode === "kanban" ? "list" : "kanban")}
          key="cambiar-vista"
        />,
       
      ]}
    >
      {/* Botón principal a la derecha */}
      <Button
        variant="primary"
        size="md"
        icon={Plus}
        onClick={onCreate}
      >
        Nueva Tarea
      </Button>
    </PageHeader>
  );
}
