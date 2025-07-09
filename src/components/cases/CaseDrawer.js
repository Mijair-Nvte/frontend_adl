// components/cases/CaseDrawer.js
"use client";

import React from "react";
import Drawer from "@/components/ui/Drawer";
import CaseForm from "./CaseForm";

export default function CaseDrawer({ isOpen, onClose, setCases, caseData = null, onSaved }) {
  const title = caseData ? "Edit project" : "New project";

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <CaseForm
        onClose={onClose}
        setCases={setCases}
        caseData={caseData}
        onSaved={onSaved}
      />
    </Drawer>
  );
}
