//app\dashboard\customers\[id]\page.js

"use client";

import { useParams } from "next/navigation";
import CustomerDetails from "@/components/customers/CustomerDetails";
import useApiClientById from "@/hooks/clients/useApiClientById";

export default function Page() {
  const { id } = useParams();
  const { client, loading, error } = useApiClientById(id);

  if (loading) return <p className="text-center py-10">Cargando cliente...</p>;
  if (error || !client) return <p className="text-center py-10 text-red-600">❌ Cliente no encontrado.</p>;

  return <CustomerDetails client={client} />;
}
