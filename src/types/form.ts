export type FormFieldType = "text" | "number" | "checkbox" | "date" | "textarea";

export type BoundingBox = {
  left: number;
  top: number;
  width: number;
  height: number;
  page: number;
};

export type FormFieldSchema = {
  id: string;
  label: string;
  type: FormFieldType;
  /** `null` is used for empty numeric fields (from extractor nulls). */
  value: string | number | boolean | null;
  required?: boolean;
  bbox: BoundingBox;
};
