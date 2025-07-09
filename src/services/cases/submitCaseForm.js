// services/cases/submitCaseForm.js
import { createCase, updateCase } from './caseService';
import { showToast } from "@/utils/toast";

export default async function submitCaseForm({
  caseData,
  formData,
  setCases,
  onSaved,
  onClose,
  resetForm,
  setLoading,
  setSuccess,
  setFormErrors,
}) {
  setLoading(true);
  try {
    const data = caseData
      ? await updateCase(caseData.id, formData)
      : await createCase(formData);

    if (caseData) {
      if (setCases) {
        setCases((prev) => prev.map((c) => (c.id === data.id ? data : c)));
      } else if (onSaved) {
        onSaved();
      }
      showToast({ type: "success", message: "Expediente actualizado correctamente." });
    } else {
      if (setCases) {
        setCases((prev) => [data, ...prev]);
      } else if (onSaved) {
        onSaved();
      }
      showToast({ type: "success", message: "Expediente creado correctamente." });
    }

    setSuccess(true);
    resetForm();
    onClose?.();
  } catch (err) {
    
    if (err.response?.status === 422) {
      const errors = err.response.data.errors;
      if (errors.case_number) {
        showToast({ type: "error", message: errors.case_number[0] || "Número de expediente ya existe" });
      } else {
        showToast({ type: "error", message: "Errores de validación. Revisa los campos." });
      }
      setFormErrors?.(errors); // Si quieres mostrar errores en el form
    } else {
      showToast({
        type: "error",
        message: "Error al guardar expediente",
      });
    }
  }  finally {
    setLoading(false);
  }
}
