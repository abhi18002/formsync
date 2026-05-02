# 📄 Frontend Evaluation – PDF Form Sync ( https://formsync-orpin.vercel.app/ )

A Next.js application that turns filled PDF forms into an interactive UI using AI. It extracts structured fields from PDFs, generates a dynamic form, and synchronizes interactions between the form and PDF viewer using bounding boxes.

---

## 🚀 What This Project Does

- Upload a filled bank-style PDF
- Send it to AI OCR for extraction
- Get structured fields + bounding boxes
- Convert OCR output into a usable frontend schema
- Render a dynamic form automatically
- Sync form focus with PDF highlights in real time

---

## How the System Works

The system is built in a simple pipeline:

1. User uploads PDF
2. We send file to Nanonets OCR API
3. AI returns:
   - Extracted field values (content)
   - Field positions (bounding boxes)
4. Response is normalized into a schema
5. UI renders dynamic form from schema
6. Zustand manages global state
7. Form interactions highlight corresponding PDF regions

---


The API returns structured JSON with:
- `fields` ->  field values + bbox


-- fallback 

- `content` → field values
- `metadata.bounding_boxes` → positions of fields in the PDF

This is the foundation of the entire system.

---

## 🧩 Schema Conversion Logic

OCR output is transformed into a frontend-friendly structure:

- Standardizes field types (text, number, checkbox, date, textarea)
- Maps extracted labels to values
- Attaches bounding box data for each field
- Filters only valid detectable fields

This ensures the UI is fully **data-driven**, not hardcoded.

---

## 📝 Dynamic Form Rendering

- Form is generated entirely from schema
- No manual form fields are written
- Supports multiple input types:
  - text
  - number
  - date
  - textarea

Behavior:
- Null values render empty inputs
- Controlled React state manages all fields

---

## 🧠 State Management

Using **Zustand**, the app manages:

- Form values
- Active focused field
- Selected bounding box
- Sync state between PDF and form

This enables instant UI updates across both panels.

---

## 📄 PDF Rendering

Using `react-pdf`:

- PDF is rendered on the left panel
- Bounding boxes are drawn as overlays
- Coordinates are mapped to canvas scale
- Active field is visually highlighted

---

## 🔄 Interaction Sync

### 👉 Form → PDF

When a user focuses a form field:
- Get field ID
- Fetch bounding box from schema
- Scroll PDF to that position
- Highlight region on PDF

---

### 👉 PDF → Form (optional enhancement)

When a user clicks a highlighted region:
- Detect bounding box
- Map it back to form field
- Focus corresponding input

---

## 🧪 Validation

Using **Zod**:

- Ensures extracted values are valid
- Prevents incorrect input states
- Keeps schema consistent

---

## 🛠️ Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Zustand (state management)
- react-pdf (PDF rendering)
- Zod (validation)
- Framer Motion (animations)
- Nanonets OCR API

---

## 🔐 Environment Variables

```env (setup in vercel env)
NANONETS_API_KEY=nanonets_api_key