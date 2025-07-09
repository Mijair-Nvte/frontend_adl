"use client";
import React, { useState } from "react";
import EntityDetailsLayout from "@/components/layout/EntityDetailsLayout";
import TreasuryInfoPanel from "./TreasuryInfoPanel";
import TreasuryFilesPanel from "./TreasuryFilesPanel"; // este es para adjuntos (lo creamos enseguida)

export default function TreasuryDetails({ movement }) {
  // Aquí puedes manejar estado para tabs, modal, refresh de archivos, etc.
  const [refreshKey, setRefreshKey] = useState(0);

  // Panel izquierdo: info principal
  // Panel derecho: tabs (actividades, archivos, comentarios futuros...)

  const rightPanel = (
    <div>
      <div className="flex gap-4 border-b pb-3 mb-4">
        {/* En el futuro puedes agregar tabs como Actividad, Notas, Comentarios */}
        <button className="text-sm font-medium text-blue-600 border-b-2 border-blue-600">
          Archivos adjuntos
        </button>
      </div>
      <TreasuryFilesPanel movementId={movement.id} key={refreshKey} onFilesChanged={() => setRefreshKey(r => r + 1)} />
    </div>
  );

  return (
    <EntityDetailsLayout
      leftPanel={<TreasuryInfoPanel movement={movement} />}
      rightPanel={rightPanel}
    />
  );
}
