import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <div className="fixed top-24 left-0 right-0 z-[60] flex justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-black/80 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 pointer-events-auto"
          >
            <AlertCircle size={20} className="text-yellow-400" />
            <span className="text-sm font-medium">{message}</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
