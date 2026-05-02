# Frontend Evaluation - PDF Form Sync

Next.js app that:
- Uploads a bank-style PDF
- Sends it to Nanonets OCR Predict API
- Builds a dynamic JSON-driven form from detected fields
- Syncs form focus with field highlights in a PDF viewer

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Zustand for global form/focus state
- react-pdf for rendering PDF + overlay highlights
- Zod for light validation of parsed values
- Framer Motion for subtle field animation

## Setup

1. Install dependencies:

```bash
yarn
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill Nanonets credentials in `.env.local`:

```bash
NANONETS_API_KEY=your_nanonets_api_key
```

4. Run dev server:

```bash
yarn dev
```

Open `http://localhost:3000`.

## How it works

- Frontend uploads PDF using `FormData` to `POST /api/extract-fields`.
- API route forwards file to:
  - `https://extraction-api.nanonets.com/api/v1/extract/sync`
  - with `output_format=json` and `include_metadata=bounding_boxes`
- The API response drives the UI from **`result.json.content`** (`result.json` may be an object or a JSON string; both are parsed).
- **`null` values** render as empty inputs; the inferred control type stays the same (`text`,
  `number`, `checkbox`, `date`, or `textarea`).
- PDF highlights use **`result.json.metadata.bounding_boxes`** (nested under `result.json`),
  keyed to content paths where possible,
  normalized to overlay coordinates (`0–1` per page width/height).

The built `fields[]` payload is convenience for the frontend; **`raw.result.json`** is authoritative for `content` + `metadata`.

- Form field focus updates global Zustand `focusedFieldId`.
- PDF viewer listens to focus state and emphasizes + scrolls to matched bounding box.

## Field Types

Supported dynamic field types:
- text
- number
- checkbox
- date
- textarea

## Notes

- The form lists **only fields that have a bbox** (`metadata.bounding_boxes` drives the controls list).
  Values fill from flattened `content` when keys match (`annual_income` ↔ `Annual Income`, etc.).
- Boxes are scaled using sizes from **`metadata`** when present (`image_width` / `image_height`,
  `page_dimensions`, …), defaulting to letter points for pixel OCR coords.
  Values in **`0–100`** with width/height as span are treated as **percent of page**.
- Overlays are aligned to the **actual rendered PDF canvas** (not a loose `inset-0` wrapper).
- If boxes look **vertically flipped**, set `NANONETS_BBOX_Y_ORIGIN=pdf-bottom` in `.env.local`.
- If extraction returns **no bounding boxes**, the form stays empty.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
