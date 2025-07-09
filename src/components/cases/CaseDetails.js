"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaLink, FaFolderPlus } from "react-icons/fa";
import useApiCaseById from "@/hooks/cases/useApiCaseById";
import CaseInfoPanel from "@/components/cases/CaseInfoPanel";
import EntityDetailsLayout from "@/components/layout/EntityDetailsLayout";
import SelectorDrawer from "@/components/shared/SelectorDrawer";
import useApiClients from "@/hooks/clients/useApiClients";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerDrawer from "@/components/customers/CustomerDrawer";
import TabMenuDetails from "@/components/ui/TabMenuDetails";
import TreasuryDrawer from "../treasury/TreasuryDrawer";
import TaskDrawer from "@/components/tasks/TaskDrawer";
import TaskDetailsDrawer from "@/components/tasks/TaskDetailsDrawer";
import { deleteTask } from '@/services/tasks/taskService';
import useApiTreasuryMovementsByCaseId from "@/hooks/treasury/useApiTreasuryMovementsByCaseId";
import TreasuryTable from "@/components/treasury/TreasuryTable";
import CustomerCardList from "../customers/mobile/CustomerCardList";
import useApiTasksByCaseId from "@/hooks/tasks/useApiTasksByCaseId";
import TaskList from "@/components/tasks/TaskList";
import DocumentLinkedList from "@/components/documents/DocumentLinkedList";
import TreasuryCardList from "../treasury/mobile/TreasuryCardList";
import TaskCardList from "../tasks/mobile/TaskCardList";
import CaseDrawer from "./CaseDrawer";

export default function CaseDetails() {
  const { id } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { caseData, loading, error } = useApiCaseById(id, refreshKey);

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const { clients, loading: loadingClients } = useApiClients();

  const [selectedClient, setSelectedClient] = useState(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);

  const { movements, loadingMovements, errorMovements, setMovements } = useApiTreasuryMovementsByCaseId(id, refreshKey);
  const [selectedMovementId, setSelectedMovementId] = useState(null);


  const [isTreasuryDrawerOpen, setIsTreasuryDrawerOpen] = useState(false);

  const { tasks, loadingTasks, errorTasks, setTasks } = useApiTasksByCaseId(id, refreshKey);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [detailsTaskId, setDetailsTaskId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDeleteTask = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      alert('Error al eliminar la tarea');
    }
  };


  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskDrawerOpen(true);
  };

  const handleViewTask = (taskId) => {
    setDetailsTaskId(taskId);
    setIsDetailsOpen(true);
  };


  const tabs = ["Clientes", "Finanzas", "Tareas","Documentos", ];
  const [activeTab, setActiveTab] = useState("Clientes");


  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading Project...</p>;

  if (error || !caseData)
    return <p className="text-center py-10 text-red-600">❌ Project not found.</p>;

  const rightPanel = (
    <div>
      <TabMenuDetails tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="space-y-4">
        {activeTab === "Clientes" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Related customer</h3>

            {!caseData.client ? (
              <div className="p-5 border border-dashed border-purple-300 rounded-xl bg-purple-50 flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-purple-800 mb-1">No customer relationship</p>
                  <p className="text-sm text-purple-700 max-w-md">
                    Puedes vincular un cliente existente desde el directorio para asignarlo a este proyecto.
                  </p>
                </div>
                <div className="flex flex-col gap-2 hidden">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                    onClick={() => setIsSelectorOpen(true)}
                  >
                    <FaLink /> 
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <CustomerTable
                    clients={[caseData.client]}
                    loading={false}
                    error={null}
                    onEditClient={(client) => {
                      setSelectedClient(client);
                      setIsCustomerDrawerOpen(true);
                    }}
                    setClients={() => { }}
                    onStatusUpdated={() => setRefreshKey((prev) => prev + 1)}
                  />
                </div>
                <div className="block md:hidden">
                  <CustomerCardList
                    clients={[caseData.client]}
                    loading={false}
                    error={null}
                    setClients={() => { }}
                    onEditClient={(client) => {
                      setSelectedClient(client);
                      setIsCustomerDrawerOpen(true);
                    }}
                    onStatusUpdated={() => setRefreshKey((prev) => prev + 1)}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
            
            </div>
          </div>
        )}

        {activeTab === "Finanzas" && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Finanzas del proyecto</h3>
            {loadingMovements ? (
              <p className="text-sm text-gray-500">Cargando movimientos...</p>
            ) : movements.length === 0 ? (
              <div className="p-5 border border-dashed border-green-300 rounded-xl bg-green-50 flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-green-800 mb-1">Sin movimientos financieros</p>
                  <p className="text-sm text-green-700 max-w-md">
                    No hay ingresos ni egresos registrados para este proyecto aún.
                  </p>
                </div>
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

        {activeTab === "Tareas" && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tareas del proyecto</h3>
            {loadingTasks ? (
              <p className="text-sm text-gray-500">Cargando tareas...</p>
            ) : tasks.length === 0 ? (
              <div className="p-5 border border-dashed border-yellow-300 rounded-xl bg-yellow-50 flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-yellow-800 mb-1">Sin tareas registradas</p>
                  <p className="text-sm text-yellow-700 max-w-md">
                    Este proyecto aún no tiene tareas asociadas.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <TaskList
                    tasks={tasks}
                    setTasks={setTasks}
                    onEditTask={handleEditTask}
                    onViewTask={handleViewTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>
                <div className="block md:hidden">
                  <TaskCardList
                    tasks={tasks}
                    onEditTask={handleEditTask}
                    onViewTask={handleViewTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "Documentos" && (
          <DocumentLinkedList caseId={id} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <EntityDetailsLayout
        leftPanel={
          <CaseInfoPanel caseData={caseData} onEdit={() => setIsDrawerOpen(true)} />
        }
        rightPanel={rightPanel}
      />

      <CustomerDrawer
        isOpen={isCustomerDrawerOpen}
        onClose={() => setIsCustomerDrawerOpen(false)}
        client={selectedClient}
        onSaved={() => {
          setIsCustomerDrawerOpen(false);
          setRefreshKey((prev) => prev + 1);
        }}
      />

      <TreasuryDrawer
        isOpen={isTreasuryDrawerOpen}
        onClose={() => setIsTreasuryDrawerOpen(false)}
        movementId={selectedMovementId}
        setMovements={setMovements}
      />

      <TaskDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        task={selectedTask}
        setTasks={setTasks} // del hook useApiTasksByCaseId
        fetchTasks={() => setRefreshKey(prev => prev + 1)}
      />

      <TaskDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setDetailsTaskId(null);
        }}
        taskId={detailsTaskId}
        onEdit={(task) => {
          setIsDetailsOpen(false);
          setSelectedTask(task);
          setIsTaskDrawerOpen(true);
        }}
      />


      <SelectorDrawer
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        title="Vincular cliente a proyecto"
        items={clients}
        loading={loadingClients}
        onSelect={async (selectedClient) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseData.id}/link-client`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ client_id: selectedClient.id }),
            });

            if (!res.ok) throw new Error("Error al vincular cliente");

            setRefreshKey(prev => prev + 1);
            setIsSelectorOpen(false);
          } catch (error) {
            alert("❌ " + error.message);
          }
        }}
      />

      <CaseDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        caseData={caseData}
        onSaved={() => {
          setIsDrawerOpen(false);
          setRefreshKey((prev) => prev + 1);
        }}
      />


    </>
  );
}
