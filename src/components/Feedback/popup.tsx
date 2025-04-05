'use client'

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface PopupProps {
  isOpen: boolean;
  message: string;
  isSuccess: boolean;
  onClose: () => void;
}

export default function Popup({ isOpen, message, isSuccess, onClose }: PopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className={`rounded-lg shadow-lg p-4 flex items-center ${
          isSuccess ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
        }`}
      >
        <div className="flex-shrink-0 mr-3">
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
        >
          <XCircle size={16} />
        </button>
      </motion.div>
    </div>
  );
}