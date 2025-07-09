'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Download, RotateCcw, Folder, CheckCircle, DollarSign, User }  from 'lucide-react';
import useApiReports from '@/hooks/reports/useApiReports';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import StatsCard from '@/components/ui/StatsCard';
import DashboardReportChart from '@/components/dashboard/DashboardReportChart';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function ReportsOverview() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { kpis, data, loading, error, refetch } = useApiReports();

  const handleFilter = () => {
    refetch({ from: fromDate, to: toDate });
  };

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    refetch();  // Llama sin filtros
  };

  const handleExportExcel = async () => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // 🎨 Estilos
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } }, // Indigo
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    const kpiLabelStyle = {
      font: { bold: true },
      alignment: { vertical: 'middle', horizontal: 'left' }
    };

    const kpiValueStyle = {
      alignment: { vertical: 'middle', horizontal: 'right' }
    };

    // ➡ Resumen General
    worksheet.addRow(['Resumen General']).font = { bold: true, size: 14 };
    worksheet.mergeCells(`A1:B1`);

    const kpiRows = [
      ['Clientes totales', kpis?.total_clients || 0],
      ['Proyectos totales', kpis?.total_cases || 0],
      ['Abogados registrados', kpis?.total_users || 0],
      ['Tareas registradas', kpis?.total_tasks || 0],
      ['Ingresos', parseFloat(kpis?.total_income || 0)],
      ['Egresos', parseFloat(kpis?.total_expenses || 0)],
      ['Balance actual', parseFloat(kpis?.balance || 0)],
    ];

    kpiRows.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.getCell(1).style = kpiLabelStyle;
      row.getCell(2).style = kpiValueStyle;
    });

    worksheet.addRow([]); // Línea en blanco

    // ➡ Tabla por mes
    const tableHeader = ['Mes', 'Proyectos', 'Clientes', 'Ingresos', 'Egresos'];
    const headerRow = worksheet.addRow(tableHeader);

    headerRow.eachCell((cell) => {
      Object.assign(cell, { style: headerStyle });
    });

    data.forEach(row => {
      const r = worksheet.addRow([
        row.name,
        row.cases,
        row.clients,
        row.income,
        row.expense
      ]);

      r.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Formato de columnas
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;

    worksheet.getColumn(4).numFmt = '$#,##0.00';
    worksheet.getColumn(5).numFmt = '$#,##0.00';

    // Exportar
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `reporte_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };


const stats = [
    {
      icon: <CheckCircle className="w-5 h-5 text-indigo-500" />,
      label: 'Clientes totales',
      value: kpis?.total_clients || 0,
      progress: '0% aumento',
      trend: 'up',
      colorClass: 'text-green-600',
    },
    {
      icon: <Folder className="w-5 h-5 text-indigo-500" />,
      label: 'Proyectos totales',
      value: kpis?.total_cases || 0,
      progress: '0% aumento',
      trend: 'up',
      colorClass: 'text-green-600',
    },
    {
      icon: <User className="w-5 h-5 text-indigo-500" />,
      label: 'Usuarios registrados',
      value: kpis?.total_users || 0,
      progress: '',
      trend: 'up',
      colorClass: 'text-green-600',
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-indigo-500" />,
      label: 'Tareas registradas',
      value: kpis?.total_tasks || 0,
      progress: '',
      trend: 'up',
      colorClass: 'text-green-600',
    },
    {
      icon: <DollarSign className="w-5 h-5 text-indigo-500" />,
      label: 'Ingresos',
      value: `$${parseFloat(kpis?.total_income || 0).toFixed(2)}`,
      progress: '',
      trend: 'up',
      colorClass: 'text-green-600',
    },
    {
      icon: <DollarSign className="w-5 h-5 text-red-500" />,
      label: 'Egresos',
      value: `$${parseFloat(kpis?.total_expenses || 0).toFixed(2)}`,
      progress: '',
      trend: 'down',
      colorClass: 'text-red-600',
    },
    {
      icon: <DollarSign className="w-5 h-5 text-indigo-500" />,
      label: 'Balance actual',
      value: `$${parseFloat(kpis?.balance || 0).toFixed(2)}`,
      progress: '',
      trend: kpis?.balance >= 0 ? 'up' : 'down',
      colorClass: kpis?.balance >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-2">
      <PageHeader title="Reportes" subtitle="Panel / Reportes">
        <div className="flex flex-col sm:flex-row gap-2">
          <DatePicker
            selected={fromDate}
            onChange={setFromDate}
            selectsStart
            startDate={fromDate}
            endDate={toDate}
            placeholderText="Desde"
            className="border rounded-md px-3 py-2 bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <DatePicker
            selected={toDate}
            onChange={setToDate}
            selectsEnd
            startDate={fromDate}
            endDate={toDate}
            placeholderText="Hasta"
            className="border rounded-md px-3 py-2 bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button variant="primary" onClick={handleFilter}>
            Aplicar
          </Button>
          <Button variant="ghost" icon={RotateCcw} onClick={handleReset}>
            Resetear
          </Button>
          <Button variant="success" icon={Download} onClick={handleExportExcel} className='hover:bg-amber-50'>
            Exportar
          </Button>
        </div>
      </PageHeader>

      {loading && <div className="text-center py-8">Cargando reportes...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((s, i) => <StatsCard key={i} {...s} />)}
      </div>

      <DashboardReportChart data={data} />
    </div>
  );
}
