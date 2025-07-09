'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import MultiSelect from "@/components/ui/MultiSelect";

export default function CaseFilterPanel({ onApply, onClose }) {
    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem('caseFilters');
        return saved ? JSON.parse(saved) : { case_status_id: '', client_id: '', lawyer_id: '' };
    });

    const [statusOptions, setStatusOptions] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);
    const [lawyerOptions, setLawyerOptions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/cases`, { headers })
            .then(res => res.json())
            .then(data => {
                setStatusOptions(data.statuses.map(s => ({ value: s.id, label: s.label })));
                setClientOptions(data.clients.map(c => ({ value: c.id, label: `${c.name} ${c.last_name}` })));
                setLawyerOptions(data.lawyers.map(u => ({
                    value: u.id,
                    label: u.name,
                    avatar: u.profile?.avatar || null
                })));
            });
    }, []);

    const handleApply = () => {
        localStorage.setItem('caseFilters', JSON.stringify(filters));
        const params = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '')
        );
        onApply(params);
        if (onClose) onClose(); // Cierra dropdown
    };

    const handleReset = () => {
        const reset = { case_status_id: '', client_id: '', lawyer_id: '' };
        setFilters(reset);
        localStorage.removeItem('caseFilters');
        onApply({});
        if (onClose) onClose(); // Cierra dropdown
    };


    return (
        <div className="w-full max-w-sm mx-auto space-y-4 p-2">
            <MultiSelect
                label="Status"
                name="case_status_id"
                options={statusOptions}
                value={statusOptions.find(opt => opt.value === filters.case_status_id) || null}
                onChange={(opt) => setFilters(prev => ({ ...prev, case_status_id: opt?.value || '' }))}
                isMulti={false}
            />

            <MultiSelect
                label="Customer"
                name="client_id"
                options={clientOptions}
                value={clientOptions.find(opt => opt.value === filters.client_id) || null}
                onChange={(opt) => setFilters(prev => ({ ...prev, client_id: opt?.value || '' }))}
                isMulti={false}
            />

            <MultiSelect
                label="User"
                name="lawyer_id"
                options={lawyerOptions}
                value={lawyerOptions.find(opt => opt.value === filters.lawyer_id) || null}
                onChange={(opt) => setFilters(prev => ({ ...prev, lawyer_id: opt?.value || '' }))}
                isMulti={false}
            />

            <div className="flex justify-between pt-2">
                <Button variant="secondary" onClick={handleReset}>Reset</Button>
                <Button onClick={handleApply}>Apply</Button>
            </div>
        </div>
    );


}
