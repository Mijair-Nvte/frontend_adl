"use client";
import { useParams } from "next/navigation";
import TreasuryDetails from "@/components/treasury/TreasuryDetails";
import useApiTreasuryMovementById from "@/hooks/treasury/useApiTreasuryMovementById";

export default function Page() {
  const { id } = useParams();
  const { movement, loading, error } = useApiTreasuryMovementById(id);

  if (loading) return <p className="text-center py-10">Cargando movimiento...</p>;
  if (error || !movement) return <p className="text-center py-10 text-red-600">❌ Movimiento no encontrado.</p>;

  return <TreasuryDetails movement={movement} />;
}
