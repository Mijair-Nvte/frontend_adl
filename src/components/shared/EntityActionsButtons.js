import React from "react";
import { FaEnvelopeOpenText, FaWhatsapp } from "react-icons/fa";

// Recibe whatsapp y email como props
export default function EntityActionsButtons({ whatsapp, email }) {
  // Genera el link para WhatsApp y mailto
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : "#";

  const emailLink = email
    ? `mailto:${email}`
    : "#";

  return (
    <div className="grid grid-cols-3 gap-3 p-6">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm bg-green-100 text-green-700 hover:bg-green-200 transition"
      >
        <FaWhatsapp /> WhatsApp
      </a>
      <a
        href={emailLink}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
      >
        <FaEnvelopeOpenText /> Correo
      </a>
    </div>
  );
}
