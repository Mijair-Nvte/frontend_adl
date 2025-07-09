"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function Drawer({
  isOpen,
  onClose,
  title = "Panel",
  size = "md", // sm, md, lg, xl
  children,
  withHeader = true,
}) {
  const maxWidths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex justify-end">
        <Dialog.Panel
          className={`w-full bg-white overflow-y-auto ${maxWidths[size]} shadow-2xl `}
        >
          {withHeader && (
            <div className="flex items-center justify-between border-b px-6 py-4 bg-indigo-600">
              <Dialog.Title className="text-lg font-semibold text-white">
                {title}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-indigo-500 transition"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          )}

          <div className="p-6">{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
