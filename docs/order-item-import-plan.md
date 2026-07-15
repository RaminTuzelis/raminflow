# Order Item Spreadsheet Import Plan

## Purpose

RaminFlow should reduce duplicate data entry when administration has already entered order data in the existing accounting workflow and received an Excel export. The import should populate editable order-item drafts; it must not silently create database records from an unreviewed file.

This plan is based on the representative workbook committed as `docs/Test_data.xlsx`. Karolis explicitly approved this file for use as shared test data so the import shape can be inspected on every development computer. It is parser input, not an order attachment, and future samples must still be reviewed and stripped of unnecessary personal metadata before they are committed.

The Create Order screen should ultimately support two complementary item-entry modes:

- manual entry through the existing item form;
- spreadsheet-assisted entry that converts supported rows into the same editable client-side draft items.

Imported items must remain editable before the order is submitted. Spreadsheet import should reduce repeated typing, not create a separate order-creation system.

## Minimal User Workflow

1. Export the usual Excel file from the existing workflow.
2. Delete item rows that should not be included in the RaminFlow order. Blank template rows may remain.
3. Upload the file in the Create Order screen.
4. Select one default material for imported rows when the spreadsheet does not provide an explicit material column.
5. Review imported items and row-level warnings.
6. Edit or remove individual items if needed.
7. Confirm the preview so the items are added to the existing order draft.
8. Submit the order through the existing server-validated creation flow.

Users should not need to delete pricing columns, formulas, or blank formatted rows. RaminFlow should ignore data that is outside the supported item mapping.

## Shared Test Workbook

The tracked sample is `docs/Test_data.xlsx`, an Office Open XML workbook with a detectable header row and adjacent accounting calculations. Its filename is deliberately generic so application code and tests do not depend on a customer or project name. The importer must likewise ignore the workbook filename as authoritative order data.

## Observed Workbook Shape

The first shared sample has these characteristics:

- `.xlsx` format;
- one worksheet;
- the header is not the first physical row;
- useful columns include item name, unit, quantity, and thickness;
- pricing, material-usage calculations, totals, and formulas appear beside the useful columns;
- many blank but formatted template rows exist after the populated rows;
- material is implied by calculation headings rather than stored as a reliable row value;
- an item row may not have a sequence number, so sequence number cannot decide whether the row is valid.

The parser must therefore detect headers by normalized labels and inspect relevant cells. It must not import every row in the worksheet's used range. A future unknown or headerless production list may justify a user-guided column-mapping workflow, but one unverified manually prepared file is not enough evidence to define a positional import profile.

## Initial Field Mapping

| Spreadsheet meaning | RaminFlow field | Rule |
| --- | --- | --- |
| Item/service name | `name` | Required non-empty text |
| Unit | `unit` | Normalize known labels to `PCS`, `M`, `M2`, or `KG` |
| Quantity | `quantity` | Required positive number |
| Thickness | `thicknessMm` | Required supported thickness option |
| Material | `materialType` | Use an explicit column when available; otherwise require a user-selected default |
| Item code | Future metadata | Ignore in the first version unless a real need is confirmed |
| Prices, totals, coefficients, formulas | Not imported | Accounting data is outside the first import boundary |

Header aliases should be explicit and testable. The first known Lithuanian labels include `Prekes (paslaugos) pavadinimas`, `Mato vnt.`, `Kiekis`, and `Storis`, while Unicode text from the real workbook must be normalized safely by the parser.

## Parsing Rules

1. Accept only explicitly supported spreadsheet formats. Start with `.xlsx`; add CSV or another legacy format only after a reviewed real sample requires it.
2. Reject macro-enabled or legacy workbooks in the first version.
3. Enforce a small configurable file-size limit before parsing.
4. Read cell values without executing macros or spreadsheet formulas.
5. Find a worksheet and header row containing the required normalized labels.
6. Build a column map from labels rather than assuming fixed column letters or row numbers.
7. Ignore a row when all supported item cells are empty.
8. Treat a partially populated relevant row as an item with validation errors, not as an empty row.
9. Preserve the source row number for understandable error messages.
10. Normalize whitespace, decimal commas/dots, and known unit spellings.
11. Treat material or thickness parsed from a description as a preview suggestion, not unquestioned structured data.
12. Do not automatically merge duplicate-looking rows; separate rows may represent intentional items.
13. Do not use the filename as trusted order data. It may only be offered as an editable project-name suggestion.

## Preview And Error UX

The upload must produce a preview before changing the order draft.

The preview should show:

- source row number;
- item name;
- quantity and normalized unit;
- material and thickness;
- error or warning text;
- edit and remove controls;
- counts for valid rows, invalid rows, and ignored empty rows.

Fatal file errors include an unsupported file type, unreadable workbook, missing required headers, or no item-like rows. Row errors include missing name, invalid quantity, unsupported unit, or unsupported thickness. A missing material column is a warning resolved by the required default-material selection.

When an order draft already contains items, the UI must ask whether imported rows should be appended or replace the current draft items. It must not guess and accidentally duplicate work.

## Application Boundary

The recommended first implementation parses the spreadsheet into the same client-side `OrderDraft` item shape already used by `CreateOrderForm`. Import confirmation updates the draft state only. The existing `createOrderDraft` Server Action remains the final security and validation boundary before PostgreSQL is changed.

Client-side parsing can avoid uploading the raw accounting workbook when the file is needed only to produce draft items. Regardless of where parsing happens, the server must validate every resulting item again because client data is untrusted.

Use a maintained spreadsheet parsing library rather than implementing the Office Open XML format manually. Select and review the dependency only when implementation begins.

## Attachments Are Separate

Spreadsheet import converts structured rows into editable item data. Attachments preserve files such as PDFs, drawings, images, and supporting spreadsheets on an order. A workbook imported into draft items is not automatically retained as an attachment.

The later attachment feature needs its own storage, metadata, access control, file validation, download authorization, backup, and retention design. Large files must not be stored directly as PostgreSQL blobs.

## Verification Cases

- header row appears after blank rows;
- supported columns move to different letters;
- blank formatted rows remain in the workbook;
- the first populated item has no sequence number;
- quantities use integers or decimal commas;
- units use known aliases such as `m.`;
- material is missing and a default is selected;
- one row has an unsupported thickness;
- one row is partially filled;
- the workbook contains pricing formulas that must be ignored;
- existing draft items are appended or replaced only after an explicit choice;
- the server rejects manipulated imported data even after a valid preview.

## Open Questions Before Implementation

- Do repeated exports keep the same Lithuanian header labels?
- Are there exports with multiple worksheets?
- Can one file contain mixed PP, PE, or PVC items?
- Are quantities always compatible with the exported unit?
- Which thickness values occur outside the current RaminFlow options?
- Should the original workbook later be retained as an authorized order attachment?
- Does the installed accounting-system version provide a supported integration interface worth considering later?

The next evidence needed is one or two additional reviewed and sanitized export shapes. Implementation should begin only after comparing them with `docs/Test_data.xlsx` and confirming the smallest stable mapping.

## Related Design Work

Before spreadsheet import implementation grows, update the current MVP diagrams to match the implemented user, authentication, authorization, and order database model. Later use-case and activity diagrams should show both manual item entry and spreadsheet-assisted draft creation, while keeping file attachments as a separate workflow.
