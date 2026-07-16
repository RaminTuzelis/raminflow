# Order Item Spreadsheet Import Plan

## Purpose

RaminFlow should reduce duplicate data entry when administration has already entered order data in the existing accounting workflow and received an Excel export. The import should populate editable order-item drafts; it must not silently create database records from an unreviewed file.

This plan is based on the structurally representative workbooks committed under `docs/import-samples/`. Their product names, codes, quantities, supplier labels, production notes, footer text, and identifying metadata are synthetic; only parser-relevant workbook shapes are retained. They are parser fixtures, not order attachments or authoritative business records. New samples must be reviewed and converted into equivalent synthetic fixtures before they are committed.

The Create Order screen should ultimately support two complementary item-entry modes:

- manual entry through the existing item form;
- spreadsheet-assisted entry that converts supported rows into the same editable client-side draft items.

Imported items must remain editable before the order is submitted. Spreadsheet import should reduce repeated typing, not create a separate order-creation system.

## Minimal User Workflow

1. Export the usual Excel file from the existing workflow.
2. Delete item rows that should not be included in the RaminFlow order. Blank template rows may remain.
3. Upload the file in the Create Order screen.
4. Select a default material and, when needed, a default thickness for imported rows when the spreadsheet does not provide those explicit columns.
5. Review imported items and row-level warnings.
6. Edit or remove individual items if needed.
7. Confirm the preview so the items are added to the existing order draft.
8. Submit the order through the existing server-validated creation flow.

Users should not need to delete pricing columns, formulas, or blank formatted rows. RaminFlow should ignore data that is outside the supported item mapping.

## Shared Test Workbooks

The tracked samples use deliberately generic filenames and synthetic row data so application code, tests, and current repository content do not depend on customer, project, supplier, employee, or company names. The importer must likewise ignore a workbook filename as authoritative order data.

| Sample | Format | Observed purpose and shape |
| --- | --- | --- |
| `test-data-excel-01.xlsx` | Office Open XML `.xlsx` | Accounting-style export with a detectable header row, useful item fields, pricing calculations, formulas, and formatted blank rows |
| `test-data-excel-02.xls` | Excel 2003 XML | Split two-row Lithuanian header followed by item name, code, unit, and quantity |
| `test-data-excel-03.xls` | Excel 2003 XML | Similar split header plus an occasional extra supplier or internal classification value |
| `test-data-excel-04.xls` | Excel 2003 XML | Split header, many blank separator rows, non-consecutive source sequence numbers, and occasional production notes in extra columns |

The `.xls` extension on samples 02-04 is historically accurate but misleading: these files contain XML, not the older binary BIFF workbook format. A parser must detect and support the actual content format instead of trusting only the extension.

The copied samples have had author and document timestamp metadata removed, their source filenames were not retained, and all business-specific row content was replaced while preserving headers, cell types, formulas, blank rows, merged notes, and other parser-relevant structure. Sanitization must be repeated for every new sample rather than assumed from its location.

Replacing or deleting a tracked sample in a later commit does not remove its earlier contents from Git history. If source-derived content was committed before complete synthetic replacement, assess and perform history cleanup separately before treating the public repository as sanitized.

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

The additional samples show that:

- several exports split one logical header across two physical rows;
- item code, unit, and quantity remain common fields across the reviewed header-based samples;
- material and thickness are often embedded in the item description rather than supplied as dedicated columns;
- extra columns can contain production notes, instructions, or supplier classifications that the first importer should not silently map;
- blank rows can appear between valid item rows rather than only after the data;
- all four samples expose the same core logical header meanings, but the physical header layout is not identical: the `.xlsx` sample uses one header row while the Excel 2003 XML samples split one logical header across two rows;
- the Excel 2003 XML samples do not provide reliable dedicated material and thickness columns, so those required RaminFlow values cannot be assumed from column position.

The parser must therefore detect headers by normalized labels and inspect relevant cells. It must not import every row in the worksheet's used range or assume that useful columns always have fixed positions.

## Initial Field Mapping

| Spreadsheet meaning | RaminFlow field | Rule |
| --- | --- | --- |
| Item/service name | `name` | Required non-empty text |
| Unit | `unit` | Normalize known labels to `PCS`, `M`, `M2`, or `KG` |
| Quantity | `quantity` | Required positive number |
| Thickness | `thicknessMm` | Use an explicit column when available; otherwise require a user-selected default or explicit row correction |
| Material | `materialType` | Use an explicit column when available; otherwise require a user-selected default |
| Item code | Future metadata | Ignore in the first version unless a real need is confirmed |
| Prices, totals, coefficients, formulas | Not imported | Accounting data is outside the first import boundary |

Header aliases should be explicit and testable. Known Lithuanian labels include `Prekes (paslaugos) pavadinimas`, `Mato vnt.`, `Mato vien.`, `Kiekis`, `Kodas`, and `Storis`, while Unicode text from the real workbooks must be normalized safely by the parser. Header detection may need to combine adjacent header rows before normalization.

## Parsing Rules

1. Accept only explicitly supported spreadsheet content formats. Start with `.xlsx`; treat Excel 2003 XML as a separate later profile even when its extension is `.xls`.
2. Reject macro-enabled and unknown binary legacy workbooks in the first version.
3. Enforce a small configurable file-size limit before parsing.
4. Read cell values without executing macros or spreadsheet formulas.
5. Find a worksheet and one or two adjacent header rows containing the required normalized labels.
6. Build a column map from labels rather than assuming fixed column letters or row numbers.
7. Ignore a row when all supported item cells are empty.
8. Treat a partially populated relevant row as an item with validation errors, not as an empty row.
9. Preserve the source row number for understandable error messages.
10. Normalize whitespace, decimal commas/dots, and known unit spellings.
11. Treat material or thickness parsed from a description as a preview suggestion, not unquestioned structured data; a missing required value must be resolved through a default or explicit row edit before submission.
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

Fatal file errors include an unsupported file type, unreadable workbook, missing required headers, or no item-like rows. Row errors include missing name, invalid quantity, unsupported unit, or unsupported thickness. Missing material or thickness columns require an explicit default selection or row-level correction before imported items can join the draft.

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
- one logical header is split across two physical rows;
- valid rows are separated by blank rows;
- source sequence numbers are non-consecutive;
- an extra notes or supplier column is present but not mapped silently;
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

The four-sample set is large enough to define a narrow header-based parser prototype and fixtures, but not one universal importer. The first implementation should recognize required normalized headers, keep the workbook reader separate from the shared row-mapping logic, report unsupported shapes clearly, and avoid guessing positional columns. Start with the `.xlsx` profile because it contains the closest match to the current required RaminFlow fields; treat Excel 2003 XML as a separate follow-up profile. Confirm which shapes are direct accounting exports and which are manually prepared lists before treating either profile as a stable external contract.

## Related Design Work

The current MVP design package already matches the implemented user, authentication, authorization, and order foundation. Its order-creation activity diagram shows both manual item entry and planned spreadsheet-assisted draft creation while keeping file attachments as a separate workflow. Update the diagrams again only when implemented behavior changes their model.
