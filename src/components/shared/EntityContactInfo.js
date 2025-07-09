import React from "react";
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";

export default function EntityContactInfo({ phone, email, estado, address }) {
  return (
    <div className="p-6 text-sm text-gray-700 space-y-3">
      <h3 className="text-base font-semibold text-gray-900">Información de contacto</h3>
      {phone && (
        <p className="flex items-center gap-2">
          <FaPhoneAlt className="text-gray-500" /> {phone}
        </p>
      )}
      {email && (
        <p className="flex items-center gap-2">
          <FaEnvelope className="text-gray-500" /> {email}
        </p>
      )}
      {estado && (
        <p className="flex items-center gap-2">
          <FaGlobe className="text-gray-500" /> {estado}
        </p>
      )}
      {address && (
        <p className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-500" /> {address}
        </p>
      )}
    </div>
  );
}
