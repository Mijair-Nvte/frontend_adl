// components/ui/Modal.js
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="bg-white rounded shadow-2xl max-w-md w-full p-6 relative"
          onClick={e => e.stopPropagation()} // No cerrar al hacer click dentro
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
