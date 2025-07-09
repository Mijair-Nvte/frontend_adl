"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "@/components/ui/Button";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de que quieres continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop con blur elegante */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-xs transition-opacity" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-xl bg-white  shadow-2xl border border-white/30 p-6 space-y-4 transition-all">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>

          <p className="text-sm text-gray-700">{message}</p>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
