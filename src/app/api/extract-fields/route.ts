import { NextRequest, NextResponse } from "next/server";

import { ocrResponseToSchema } from "@/lib/ocr-to-schema";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
    }

    const apiKey = process.env.NANONETS_API_KEY || 
    "8e533e57-b131-474b-a7db-de153b53ccfc";
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Missing NANONETS_API_KEY in environment variables 2w",
        },
        { status: 500 },
      );
    }

    const upstreamBody = new FormData();
    upstreamBody.append("file", file, file.name);
    upstreamBody.append("output_format", "json");
    upstreamBody.append("include_metadata", "bounding_boxes");
    const response = await fetch("https://extraction-api.nanonets.com/api/v1/extract/sync", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: upstreamBody,
    });

    const raw = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: "Nanonets API request failed", details: raw },
        { status: response.status },
      );
    }
console.log("resulyss",raw);

    const fields = ocrResponseToSchema(raw);
    return NextResponse.json({ fields, raw });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected extraction failure",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
