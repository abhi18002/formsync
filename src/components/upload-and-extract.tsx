"use client";

import { ChangeEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useFormStore } from "@/store/form-store";

type Stage = "idle" | "processing" | "done";

export function UploadAndExtract() {
  const { setFields, setPdfUrl, setRawOcr, pdfUrl } = useFormStore();

  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FILE UPLOAD ---------------- */

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setError(null);

    try {
      setStage("processing");

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/extract-fields", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFields(data.fields);
      setRawOcr(data.raw);

      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setStage("idle");
    }
  };

  const reset = () => {
    setStage("idle");
    setPdfUrl(null);
    setFields([]);
    setRawOcr(null);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ---------------- UPLOAD ---------------- */}
        {stage === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full items-center justify-center px-4"
          >
            <motion.label
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900/80 p-8 backdrop-blur-md transition"
            >
              {/* Glow Upload Circle */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.1)",
                    "0 0 40px rgba(255,255,255,0.25)",
                    "0 0 20px rgba(255,255,255,0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-600"
              >
                 <svg
     xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-zinc-300 animate-flicker"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
              </motion.div>

              {/* Text */}
              <p className="text-base font-medium text-white">
                Upload your PDF
              </p>

      
              <p className="mt-2 text-xs text-zinc-500">
                Drag & drop or click to browse
              </p>

              <p className="mt-4 text-xs text-zinc-600">
                Supports bank forms, invoices, documents
              </p>

              {/* Input */}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={onFileChange}
              />
            </motion.label>
          </motion.div>
        )}

        {/* ---------------- PROCESSING ---------------- */}
        {stage === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full flex-col items-center justify-center gap-6"
          >
            <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />

            {/* Progress bar */}
            <div className="w-72 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "linear",
                }}
              />
            </div>

            <p className="text-sm text-zinc-400">
              Extracting fields • Mapping values • Structuring form
            </p>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ERROR */}
      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}