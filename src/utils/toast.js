// utils/toast.js
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

// Mapear los íconos por tipo
const icons = {
  success: <CheckCircle className="text-green-500 w-5 h-5" />,
  error: <XCircle className="text-red-500 w-5 h-5" />,
  warning: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
  info: <Info className="text-blue-500 w-5 h-5" />,
};

// Colores por tipo (personalízalos como gustes)
const styles = {
  success: {
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #34d399"
  },
  error: {
    background: "#fff0f0",
    color: "#b91c1c",
    border: "1px solid #fca5a5"
  },
  warning: {
    background: "#fef9c3",
    color: "#92400e",
    border: "1px solid #fde68a"
  },
  info: {
    background: "#e0e7ff",
    color: "#3730a3",
    border: "1px solid #a5b4fc"
  }
};

// Helper global
export function showToast({
  type = "info", // "success", "error", "warning", "info"
  message,
  description = "",
  duration = 4000
}) {
  toast(message, {
    description,
    duration,
    icon: icons[type],
    style: styles[type]
  });
}
