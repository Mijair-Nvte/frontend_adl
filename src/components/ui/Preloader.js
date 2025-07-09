'use client';

import { motion } from 'framer-motion';

export default function Preloader({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-600">
      <motion.div
        className="dot-spinner relative flex items-center justify-center w-12 h-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`dot-spinner-dot absolute w-full h-full flex items-center justify-start`}
            style={{ transform: `rotate(${i * 45}deg)` }}
          >
            <div className="dot-spinner-dot-inner" />
          </div>
        ))}
      </motion.div>
      <p className="mt-2 text-sm">{message}</p>

      <style jsx global>{`
        .dot-spinner-dot-inner {
          height: 20%;
          width: 20%;
          border-radius: 9999px;
          background-color: #1745d1; /* blue-800 */
          opacity: 0.5;
          transform: scale(0);
          animation: pulse-dot 1s ease-in-out infinite;
        }
        .dot-spinner-dot:nth-child(1) .dot-spinner-dot-inner {
          animation-delay: -0.875s;
        }
        .dot-spinner-dot:nth-child(2) .dot-spinner-dot-inner {
          animation-delay: -0.75s;
        }
        .dot-spinner-dot:nth-child(3) .dot-spinner-dot-inner {
          animation-delay: -0.625s;
        }
        .dot-spinner-dot:nth-child(4) .dot-spinner-dot-inner {
          animation-delay: -0.5s;
        }
        .dot-spinner-dot:nth-child(5) .dot-spinner-dot-inner {
          animation-delay: -0.375s;
        }
        .dot-spinner-dot:nth-child(6) .dot-spinner-dot-inner {
          animation-delay: -0.25s;
        }
        .dot-spinner-dot:nth-child(7) .dot-spinner-dot-inner {
          animation-delay: -0.125s;
        }
        .dot-spinner-dot:nth-child(8) .dot-spinner-dot-inner {
          animation-delay: 0s;
        }

        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
