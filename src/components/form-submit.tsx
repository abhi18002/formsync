"use client";

import { motion, AnimatePresence } from "framer-motion";

export function SubmitModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: any;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-[520px] rounded-lg bg-zinc-900 p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h2 className="text-white text-lg mb-4">
              Saved Data
            </h2>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {data &&
                Object.entries(data).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between border-b border-zinc-800 py-2"
                  >
                    <span className="text-zinc-400 text-sm">
                      {k}
                    </span>
                    <span className="text-white text-sm">
                      {String(v)}
                    </span>
                  </div>
                ))}
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full bg-white text-black py-2 rounded"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}