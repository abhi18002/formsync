"use client";

import { create } from "zustand";
import { FormFieldSchema } from "@/types/form";

type FormStore = {
  fields: FormFieldSchema[];
  focusedFieldId: string | null;
  pdfUrl: string | null;
  rawOcr: unknown;

  uploadMode: boolean;

  setUploadMode: (v: boolean) => void;
  setFields: (fields: FormFieldSchema[]) => void;
  setFieldValue: (
    id: string,
    value: string | number | boolean | null
  ) => void;
  setFocusedFieldId: (id: string | null) => void;
  setPdfUrl: (url: string | null) => void;
  setRawOcr: (raw: unknown) => void;
};

export const useFormStore = create<FormStore>((set) => ({
  fields: [],
  focusedFieldId: null,
  pdfUrl: null,
  rawOcr: null,

  uploadMode: false,

  setUploadMode: (v) => set({ uploadMode: v }),

  setFields: (fields) => set({ fields }),

  setFieldValue: (id, value) =>
    set((state) => ({
      fields: state.fields.map((f) =>
        f.id === id ? { ...f, value } : f
      ),
    })),

  setFocusedFieldId: (id) => set({ focusedFieldId: id }),
  setPdfUrl: (url) => set({ pdfUrl: url }),
  setRawOcr: (raw) => set({ rawOcr: raw }),
}));