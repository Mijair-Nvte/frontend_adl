import { createClient, updateClient } from './clientService';
import { showToast } from "@/utils/toast";

export default async function submitCustomerForm({
  client,
  formData,
  setClients,
  onSaved,
  onClose,
  resetForm,
  setLoading,
  setSuccess
}) {
  setLoading(true);
  try {
    const data = client
      ? await updateClient(client.id, formData)
      : await createClient(formData);

    if (client) {
      if (setClients) {
        setClients((prev) =>
          prev.map((c) => (c.id === client.id ? data.client : c))
        );
      } else if (onSaved) {
        onSaved();
      }
      // Toast de edición exitosa
      showToast({
        type: "success",
        message: "Cliente actualizado correctamente."
      });

    } else {
      if (setClients) {
        setClients((prev) => [data.client, ...prev]);
      } else if (onSaved) {
        onSaved();
      }
      // Toast de creación exitosa
      showToast({
        type: "success",
        message: "Cliente creado correctamente."
      });
    }

    setSuccess(true);
    resetForm();
    onClose();
  } catch (err) {
    showToast({
      type: "error",
      message: "Error al guardar cliente",
    });

  } finally {
    setLoading(false);
  }
}
