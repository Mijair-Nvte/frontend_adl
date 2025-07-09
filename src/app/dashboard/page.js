'use client';

import React, { useState } from 'react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardReportChart from '@/components/dashboard/DashboardReportChart';
import CaseTable from '@/components/cases/CaseTable';
import CaseCardList from '@/components/cases/mobile/CaseCardList';
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerCardList from '@/components/customers/mobile/CustomerCardList';
import CaseDrawer from '@/components/cases/CaseDrawer';
import CustomerDrawer from '@/components/customers/CustomerDrawer';
import useApiCases from '@/hooks/cases/useApiCases';
import useApiClients from '@/hooks/clients/useApiClients';
import useApiDashboard from '@/hooks/dashboard/useApiDashboard';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import useApiDashboardChart from '@/hooks/dashboard/useApiDashboardChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function DashboardHome() {
  const { cases, setCases, loading: loadingCases, error: errorCases } = useApiCases();
  const { clients, setClients, loading: loadingClients, error: errorClients } = useApiClients();
  const { dashboardData, loadingDashboard, errorDashboard } = useApiDashboard();

  const [isCaseDrawerOpen, setIsCaseDrawerOpen] = useState(false);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);

  const handleCreateCase = () => setIsCaseDrawerOpen(true);
  const handleCreateCustomer = () => setIsCustomerDrawerOpen(true);

  const recentCases = cases ? cases.slice(0, 5) : [];
  const recentClients = clients ? clients.slice(0, 5) : [];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedYear = selectedDate.getFullYear();
  const { chartData, loading: loadingChart, error: errorChart } = useApiDashboardChart(selectedYear);

  const [caseToEdit, setCaseToEdit] = useState(null);
  const [customerToEdit, setCustomerToEdit] = useState(null);


  const handleEditCase = (caseItem) => {
    setCaseToEdit(caseItem);
    setIsCaseDrawerOpen(true);
  };

  const handleEditCustomer = (client) => {
    setCustomerToEdit(client);
    setIsCustomerDrawerOpen(true);
  };



  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Panel / Dashboard"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="primary" size="md" icon={Plus} onClick={handleCreateCase}>
            Projects
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={handleCreateCustomer}>
            Customer
          </Button>
        </div>
      </PageHeader>

      <div className="mb-6">
        {loadingDashboard ? (
          <p>Cargando métricas...</p>
        ) : errorDashboard ? (
          <p className="text-red-500">{errorDashboard}</p>
        ) : (
          <DashboardStats data={dashboardData} />
        )}
      </div>

      <div className="mb-10">
        <div className="flex justify-end mb-2">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showYearPicker
            dateFormat="yyyy"
            className="border rounded-md px-3 py-2 bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

        </div>
        <DashboardReportChart
          data={chartData}
          loading={loadingChart}
          error={errorChart}
        />
      </div>

      {/* Expedientes recientes */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Recent projects</h2>
          <Link href="/dashboard/cases">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>
        <div className="hidden md:block">
          <CaseTable
            cases={recentCases}
            setCases={setCases}
            loading={loadingCases}
            error={errorCases}
            onEditCase={handleEditCase}
            onDeletedCase={() => { }}
            onStatusUpdated={() => { }}
          />
        </div>
        <div className="block md:hidden">
          <CaseCardList
            cases={recentCases}
            setCases={setCases}
            loading={loadingCases}
            error={errorCases}
            onEditCase={handleEditCase}
          />
        </div>
      </div>

      {/* Clientes recientes */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Recent customer</h2>
          <Link href="/dashboard/customers">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>
        <div className="hidden md:block">
          <CustomerTable
            clients={recentClients}
            setClients={setClients}
            loading={loadingClients}
            error={errorClients}
            onEditClient={handleEditCustomer}
          />
        </div>
        <div className="block md:hidden">
          <CustomerCardList
            clients={recentClients}
            setClients={setClients}
            loading={loadingClients}
            error={errorClients}
            onEditClient={handleEditCustomer}
          />
        </div>
      </div>

      {/* DRAWERS */}
      <CaseDrawer
        isOpen={isCaseDrawerOpen}
        onClose={() => {
          setIsCaseDrawerOpen(false);
          setCaseToEdit(null);
        }}
        setCases={setCases}
        caseData={caseToEdit}
      />

      <CustomerDrawer
        isOpen={isCustomerDrawerOpen}
        onClose={() => {
          setIsCustomerDrawerOpen(false);
          setCustomerToEdit(null);
        }}
        setClients={setClients}
        client={customerToEdit}
      />

    </div>
  );
}
