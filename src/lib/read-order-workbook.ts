import { readSheet } from "read-excel-file/universal";
import { parseImportRows } from "./order-import";

export async function readOrderWorkbook(file: File) {
  const sheet = await readSheet(file);
  const rows = sheet.map((row) => {
    return row.map((cell) => String(cell ?? ""));
  });
  return parseImportRows(rows);
}
