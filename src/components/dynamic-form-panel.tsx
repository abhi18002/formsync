"use client";

import { z } from "zod";
import { motion } from "framer-motion";

import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDisclosure } from "@/lib/custom-hook";
import { useState } from "react";

import { SubmitModal } from "@/components/form-submit";

/* ---------------- ZOD ---------------- */

const formSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()])
);

/* ---------------- COMPONENT ---------------- */

export function DynamicFormPanel() {
  const { fields, setFieldValue, setFocusedFieldId } = useFormStore();

  const {
    isOpen: isFormSubmitOpen,
    onClose: onFormSubmitClose,
    onOpen: onFormSubmitOpen,
} = useDisclosure();

const [submittedData, setSubmittedData] = useState<any>(null);


  /* -------- submit -------- */

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      fields.map((f) => [f.label, f.value])
    );

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      console.log("❌ Validation errors", result.error.format());
      alert("Invalid form data");
      return;
    }

    console.log("✅ Final Form Data", result.data);
    setSubmittedData(result.data)
    onFormSubmitOpen();
    localStorage.setItem("form-data", JSON.stringify(result.data));

  };

  /* -------- render -------- */

  return (
    <Card className="h-[90vh] overflow-auto">
      <CardHeader>
        <CardTitle>Detected Fields</CardTitle>
        <CardDescription>
          Click a field to highlight it on the PDF.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {fields.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No fields detected yet.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {fields.map((field) => {
              const commonProps = {
                id: field.id,
                onFocus: () => setFocusedFieldId(field.id),
                onBlur: () => setFocusedFieldId(null),
              };

              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 border p-3 rounded-md"
                >
                  <Label htmlFor={field.id}>{field.label}</Label>


                  {/* textarea */}
                  {field.type === "textarea" && (
                    <Textarea
                      {...commonProps}
                      value={String(field.value ?? "")}
                      onChange={(e) =>
                        setFieldValue(field.id, e.target.value)
                      }
                    />
                  )}

                  {/* input */}
                  {field.type !== "checkbox" &&
                    field.type !== "textarea" && (
                      <Input
                        {...commonProps}
                        type={
                          field.type === "number"
                            ? "number"
                            : field.type === "date"
                            ? "date"
                            : "text"
                        }
                        value={
                           String(field.value ?? "")
                        }
                        onChange={(e) => {
                          const val = e.target.value;

                          if (field.type === "number") {
                            setFieldValue(
                              field.id,
                              val === "" ? null : Number(val)
                            );
                          } else {
                            setFieldValue(field.id, val);
                          }
                        }}
                      />
                    )}
                </motion.div>
              );
            })}

            <Button type="submit" className="w-full">
              Save Form Data
            </Button>
          </form>
        )}

      {/* MODAL */}
      <SubmitModal
        open={isFormSubmitOpen}
        onClose={onFormSubmitClose}
        data={submittedData}
      />
      </CardContent>
    </Card>
  );
}