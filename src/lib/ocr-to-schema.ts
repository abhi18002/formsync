import { BoundingBox, FormFieldSchema, FormFieldType } from "@/types/form";
import { toCapitalCase } from "./utils";


function getType(label: string, value: any): FormFieldType {
  const text = `${label} ${value}`.toLowerCase();

  if (text.includes("date")) return "date";
  if (!isNaN(Number(value))) return "number";
  if (text.includes("address") || String(value).length > 40) return "textarea";

  return "text";
}

function isBoolean(val: any) {
  if (typeof val === "boolean") return true;
  if (typeof val === "string") {
    const v = val.toLowerCase();
    return ["yes", "no", "true", "false"].includes(v);
  }
  return false;
}

function normalizeBBox(box: any): BoundingBox {
  return {
    left: Number(box?.x ?? box?.left ?? 0),
    top: Number(box?.y ?? box?.top ?? 0),
    width: Number(box?.width ?? 0.01),
    height: Number(box?.height ?? 0.01),
    page: Number(box?.page ?? 1),
  };
}

/* ---------------- flatten bbox ---------------- */

function flattenBoxes(obj: any, prefix = ""): any[] {
  if (!obj || typeof obj !== "object") return [];

  const out: any[] = [];

  for (const key in obj) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (!value) continue;

    // ✅ leaf bbox
    if (
      typeof value === "object" &&
      "x" in value &&
      "y" in value &&
      "width" in value &&
      "height" in value
    ) {
      out.push({
        key: path,
        ...value,
      });
    } else if (typeof value === "object") {
      out.push(...flattenBoxes(value, path));
    }
  }

  return out;
}

/* ---------------- get value from content ---------------- */

function getValue(content: any, path: string) {
  if (!content) return "";

  const keys = path.split(".");
  let curr = content;

  for (const k of keys) {
    if (curr && typeof curr === "object" && k in curr) {
      curr = curr[k];
    } else {
      return "";
    }
  }

  return typeof curr === "object" ? "" : curr;
}

/* ---------------- main ---------------- */

export function ocrResponseToSchema(payload: any): FormFieldSchema[] {
  const json = payload?.result?.json || {};

  const fields = json?.fields;
  const content = json?.content || {};
  const rawBoxes = json?.metadata?.bounding_boxes || {};

  let result: FormFieldSchema[] = [];

  /* -------- CASE 1: valid fields -------- */
  if (Array.isArray(fields) && fields.length >= 2) {
    result = fields.map((f: any, i: number) => ({
      id: f.id || `field-${i}`,
      label: (f.label || "").trim() || `Field ${i + 1}`,
      type: f.type || getType(f.label, f.value),
      value: f.value ?? "",
      required: false,
      bbox: f.bbox,
    }));
  }

  /* -------- CASE 2: fallback( when fields identified are less) -------- */
  else {
    const boxes = flattenBoxes(rawBoxes);

    result = boxes.map((b: any, i: number) => {
      const value = getValue(content, b.key);

      const lastKey = toCapitalCase(b.key).split(".").pop();
      const label = lastKey
                    ? lastKey.replaceAll("_", " ")
                    : `Field ${i + 1}`;

      return {
        id: `field-${i}`,
        label,
        type: getType(label, value),
        value,
        required: false,
        bbox: normalizeBBox(b),
      };
    });
  }

  /* -------- clean -------- */

  // removing empty values
  result = result.filter((f) => f.value !== "");

  // just to limit-  removing boolean fields 
  result = result.filter((f) => !isBoolean(f.value));

  return result;
}