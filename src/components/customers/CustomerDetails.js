"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useApiClientById from "@/hooks/clients/useApiClientById";
import useApiCasesByClientId from "@/hooks/cases/useApiCasesByClientId";
import useApiCasesModal from "@/hooks/cases/useApiCasesModal";
import CustomerDrawer from "@/components/customers/CustomerDrawer";
import CaseDrawer from "@/components/cases/CaseDrawer";
import TreasuryDrawer from "../treasury/TreasuryDrawer";
import EntitySelectorModal from "@/components/shared/EntitySelectorModal";
import EntityDetailsLayout from "@/components/layout/EntityDetailsLayout";
import ClientInfoPanel from "@/components/customers/ClientInfoPanel";
import CaseTable from "@/components/cases/CaseTable";
import { FaLink, FaFolderPlus } from "react-icons/fa";
import TabMenuDetails from "@/components/ui/TabMenuDetails";

import useApiTreasuryMovementsByClientId from "@/hooks/treasury/useApiTreasuryMovementsByClientId";
import TreasuryTable from "@/components/treasury/TreasuryTable";
import TreasuryCardList from "../treasury/mobile/TreasuryCardList";
import CaseCardList from "../cases/mobile/CaseCardList";

export default function CustomerDetails() {
  const { id } = useParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const { client, loading, error } = useApiClientById(id, refreshKey);
  const { cases, loadingCases, errorCases } = useApiCasesByClientId(id, refreshKey);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isCaseDrawerOpen, setIsCaseDrawerOpen] = useState(false);
  const { options: casesOptions, loading: loadingModalCases, fetchCases: fetchModalCases } = useApiCasesModal();


  const { movements, loadingMovements, errorMovements, setMovements } = useApiTreasuryMovementsByClientId(id, refreshKey);
  const [selectedMovementId, setSelectedMovementId] = useState(null);

  const [isTreasuryDrawerOpen, setIsTreasuryDrawerOpen] = useState(false);


  const tabs = ["Proyecto", "Finanzas"];
  const [activeTab, setActiveTab] = useState("Proyectos");

  // este useEffect se asegura de cargar los casos al abrir el modal
  useEffect(() => {
    if (isEntityModalOpen) {
      fetchModalCases();
    }
  }, [isEntityModalOpen, fetchModalCases]);

  if (loading)
    return <p className="text-center py-10 text-gray-600">Cargando cliente...</p>;
  if (error || !client)
    return <p className="text-center py-10 text-red-600">❌ Cliente no encontrado.</p>;

  const rightPanel = (
    <div>
      <TabMenuDetails tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="space-y-4">
        {/* Proyectos */}
        {activeTab === "Proyectos" && (
          <>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Proyectos vinculados</h3>
            {loadingCases ? (
              <p className="text-sm text-gray-500">Cargando Proyectos...</p>
            ) : cases.length === 0 ? (
              <div className="p-5 border border-dashed border-purple-300 rounded-xl bg-purple-50 flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-purple-800 mb-1">Proyectos vinculados</p>
                  <p className="text-sm text-purple-700 max-w-md">
                    Asocia Proyectos a tus clientes y ten control eficiente de la información.
                    Puedes vincular un Proyectos existente o crear uno nuevo desde el directorio.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    onClick={() => setIsEntityModalOpen(true)}
                  >
                    <FaLink size={14} /> Vincular
                  </button>

                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                    onClick={() => {
                      setSelectedCase(null);
                      setIsCaseDrawerOpen(true);
                    }}
                  >
                    <FaFolderPlus /> Crear
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <CaseTable
                    cases={cases}
                    loading={loadingCases}
                    error={errorCases}
                    onStatusUpdated={() => setRefreshKey((prev) => prev + 1)}
                    onDeletedCase={() => setRefreshKey((prev) => prev + 1)}
                    onEditCase={(item) => {
                      setSelectedCase(item);
                      setIsCaseDrawerOpen(true);
                    }}
                    clientId={client.id}
                  />
                </div>
                <div className="block md:hidden">
                  <CaseCardList
                    cases={cases}
                    loading={loadingCases}
                    error={errorCases}
                    setCases={() => { }}
                    onEditCase={(item) => {
                      setSelectedCase(item);
                      setIsCaseDrawerOpen(true);
                    }}
                    onDeletedCase={() => setRefreshKey((prev) => prev + 1)}
                    onStatusUpdated={() => setRefreshKey((prev) => prev + 1)}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                onClick={() => setIsEntityModalOpen(true)}
              >
                <FaLink size={14} /> Vincular
              </button>

              <button
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                onClick={() => {
                  setSelectedCase(null);
                  setIsCaseDrawerOpen(true);
                }}
              >
                <FaFolderPlus size={14} /> Crear
              </button>
            </div>
          </>
        )}

        {/* Llamadas */}
        {activeTab === "Finanzas" && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Finanzas</h3>
            {loadingMovements ? (
              <p className="text-sm text-gray-500">Cargando movimientos...</p>
            ) : movements.length === 0 ? (
              <div className="p-5 border border-dashed border-green-300 rounded-xl bg-green-50 flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-green-800 mb-1">Sin movimientos financieros</p>
                  <p className="text-sm text-green-700 max-w-md">
                    No hay ingresos ni egresos registrados para este cliente aún.
                    <br />
                    Puedes agregar un nuevo movimiento desde la sección de Tesorería o aquí mismo.
                  </p>
                </div>
                {/* Aquí podrías poner un botón para agregar movimiento en el futuro */}
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <TreasuryTable
                    movements={movements}
                    loading={loadingMovements}
                    error={errorMovements}
                    setMovements={setMovements}
                    onEditMovement={(movement) => {
                      setSelectedMovementId(movement.id);
                      setIsTreasuryDrawerOpen(true);
                    }}
                  />
                </div>
                <div className="block md:hidden">
                  <TreasuryCardList
                    movements={movements}
                    setMovements={setMovements}
                    onEditMovement={(movement) => {
                      setSelectedMovementId(movement.id);
                      setIsTreasuryDrawerOpen(true);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}



      </div>
    </div>
  );

  return (
    <>
      <EntityDetailsLayout
        leftPanel={<ClientInfoPanel client={client} onEdit={() => setIsDrawerOpen(true)} />}
        rightPanel={rightPanel}
      />

      <CustomerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        client={client}
        onSaved={() => setRefreshKey(prev => prev + 1)}
      />

      <CaseDrawer
        isOpen={isCaseDrawerOpen}
        onClose={() => setIsCaseDrawerOpen(false)}
        caseData={selectedCase}
        onSaved={() => setRefreshKey(prev => prev + 1)}
      />

      <TreasuryDrawer
        isOpen={isTreasuryDrawerOpen}
        onClose={() => setIsTreasuryDrawerOpen(false)}
        movementId={selectedMovementId}
        setMovements={setMovements}
      />

      <EntitySelectorModal
        isOpen={isEntityModalOpen}
        onClose={() => setIsEntityModalOpen(false)}
        title="Vincular Proyectos a cliente"
        options={casesOptions}
        isLoading={loadingModalCases}
        onSelect={async (selected) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${selected.value}/link-client`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ client_id: client.id }),
            });

            if (!res.ok) throw new Error("Error al vincular Proyectos");
            setRefreshKey((prev) => prev + 1);
            setIsEntityModalOpen(false);
          } catch (err) {
            alert("❌ " + err.message);
          }
        }}
      />
    </>
  );
}
