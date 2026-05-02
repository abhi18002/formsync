"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { useFormStore } from "@/store/form-store";
import type { FormFieldSchema } from "@/types/form";
import { cn } from "@/lib/utils";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PAGE_WIDTH = 700;

export function PdfViewerPanel() {
  const { pdfUrl, fields, focusedFieldId } = useFormStore();
  const [numPages, setNumPages] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const focusedOverlayRef = useRef<HTMLDivElement | null>(null);

  const fieldsByPage = useMemo(() => {
    return fields.reduce<Record<number, FormFieldSchema[]>>((acc, field) => {
      const pg = field.bbox.page || 1;
      if (!acc[pg]) acc[pg] = [];
      acc[pg].push(field);
      return acc;
    }, {});
  }, [fields]);

  useEffect(() => {
    if (!focusedOverlayRef.current || !scrollContainerRef.current) return;
    focusedOverlayRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [focusedFieldId]);

  if (!pdfUrl) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
        Upload a bank-style PDF to start extraction and field syncing.
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-[90vh] overflow-auto rounded-lg border border-zinc-200 bg-zinc-100 p-4"
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={(doc) => setNumPages(doc.numPages)}
        loading={<div className="p-4 text-sm text-zinc-600">Loading PDF...</div>}
      >
        {Array.from(new Array(numPages), (_, index) => {
          const page = index + 1;
          return (
            <div key={page} className="relative mx-auto mb-4 w-fit">
              <Page pageNumber={page} width={PAGE_WIDTH} renderTextLayer={false} />
              <div className="pointer-events-none absolute inset-0">
                {(fieldsByPage[page] ?? []).map((field) => {
                  const isFocused = focusedFieldId === field.id;
                  return (
                    <div
                      key={field.id}
                      ref={isFocused ? focusedOverlayRef : null}
                      className={cn(
                        "absolute rounded-sm border transition-all duration-300",
                        isFocused
                          ? "border-sky-600 bg-sky-500/25 shadow-[0_0_0_2px_rgba(2,132,199,0.4)]"
                          : "border-amber-500/70 bg-amber-300/25",
                      )}
                      style={{
                        left: `${field.bbox.left * 100}%`,
                        top: `${field.bbox.top * 100}%`,
                        width: `${field.bbox.width * 100}%`,
                        height: `${field.bbox.height * 100}%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </Document>
      
    </div>
  );
}
