// services/treasury/submitTreasuryForm.js

import { createTreasuryMovement, updateTreasuryMovement } from "./treasuryService";

export default async function submitTreasuryForm({
  movement,
  formData,
  setMovements,
  fetchMovements,
  onClose,
  resetForm,
  setLoading,
  setSuccess,
}) {
  setLoading(true);
  try {
    let data;
    if (movement) {
      data = await updateTreasuryMovement(movement.id, formData);
    } else {
      data = await createTreasuryMovement(formData);
    }
    if (fetchMovements) {
      fetchMovements();
    } else if (setMovements) {
      setMovements((prev) =>
        movement
          ? prev.map((c) => (c.id === movement.id ? data.data : c))
          : [data.data, ...prev]
      );
    }
    setSuccess(true);
    resetForm();
    onClose();
  } catch (err) {
    console.error("Error al guardar movimiento", err);
    alert("❌ " + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
  }
}
