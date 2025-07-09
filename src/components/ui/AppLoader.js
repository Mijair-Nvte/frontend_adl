'use client';

import { motion } from 'framer-motion';

export default function AppLoader() {
  const letters = 'ACADEMIA DE LIMPIEZA'.split('');

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex space-x-1">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="text-5xl font-extrabold text-blue-900"
            animate={{
              opacity: [0.6, 1, 0.6],
              y: [0, -2, 0],
            }}
            transition={{
              delay: index * 0.1,
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      <motion.div className="mt-4 flex space-x-2">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="w-2 h-2 bg-blue-900 rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              delay: dot * 0.3,
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          ></motion.span>
        ))}
      </motion.div>

     
    </div>
  );
}
