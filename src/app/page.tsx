"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { UploadAndExtract } from "@/components/upload-and-extract";
import { DynamicFormPanel } from "@/components/dynamic-form-panel";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";

const PdfViewerPanel = dynamic(
  () => import("@/components/pdf-viewer-panel").then((m) => m.PdfViewerPanel),
  { ssr: false }
);

export default function Home() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { fields, pdfUrl,setFields } = useFormStore();

  const hasData = fields.length > 0 && pdfUrl;

  const scrollToApp = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-zinc-950 text-white">

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-screen items-center justify-center px-6 text-center overflow-hidden">

        {/* BG */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://cdn.dribbble.com/userupload/12624418/file/original-30fe032dd34b29ead13ff2a2249e6eea.gif')",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-[2px]" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-2xl">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-6xl md:text-7xl font-bold tracking-tight"
          >
            FormSync
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 text-xl md:text-2xl font-semibold text-white"
          >
            AI-powered PDF → Form conversion
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-5 text-sm md:text-base text-zinc-300 leading-relaxed"
          >
            Upload a PDF and let AI detect fields, extract values, and convert it into a fully editable form.
            <br />
            Everything stays synced with the original document — so you can review and edit with precision.
          </motion.p>

          <motion.button
            onClick={scrollToApp}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black shadow-xl"
          >
            Start extracting
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-3 text-xs text-zinc-500"
          >
            No signup required • Works instantly
          </motion.p>
        </div>
      </section>

      {/* ---------------- APP ---------------- */}
  {/* ---------------- APP ---------------- */}
<section
  ref={sectionRef}
  className="h-screen border-t border-zinc-800 bg-zinc-950 overflow-hidden"
>
  {!hasData ? (
    <div className="flex h-full items-center justify-center p-6">
      <UploadAndExtract />
    </div>
  ) : (
    <div className="flex h-full items-stretch">
      
      {/* PDF - Left Side */}
      <div className="w-1/2 h-full border-r border-zinc-800 overflow-auto">
      <div className="p-8">
      <PdfViewerPanel />
      <div className="flex items-center justify-between border-t border-zinc-800 p-3">
        <p className="text-xs text-zinc-400">
          Want to change PDF?
        </p>

        <Button
          variant="outline"
          className="text-black"
          onClick={() => {setFields([])}}
        >
          Re-upload PDF
        </Button>
      </div>
        </div>
      
      </div>

      {/* FORM - Right Side */}
      <div className="w-1/2 h-full overflow-y-auto ">
        <div className="p-8">
          <DynamicFormPanel />
        </div>
      </div>

    </div>
  )}
</section>
    </div>
  );
}