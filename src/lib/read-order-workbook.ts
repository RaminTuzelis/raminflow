import { readSheet } from "read-excel-file/universal";
import { parseImportRows } from "./order-import";
import { readExcelXmlRows } from "./read-excel-xml";

export class UnsupportedOrderWorkbookError extends Error {}

export function isSupportedOrderWorkbook(fileName: string) {
  return /\.(xlsx|xls)$/i.test(fileName);
}

export async function readOrderWorkbook(file: File) {
  if (!isSupportedOrderWorkbook(file.name)) {
    throw new UnsupportedOrderWorkbookError("Choose an .xlsx or .xls file.");
  }

  if (/\.xls$/i.test(file.name)) {
    const rows = readExcelXmlRows(new Uint8Array(await file.arrayBuffer()));
    if (rows === undefined) {
      throw new UnsupportedOrderWorkbookError(
        "This .xls file must use the Excel 2003 XML format. Save it as .xlsx and try again.",
      );
    }
    return parseImportRows(rows);
  }

  const sheet = await readSheet(file);
  const rows = sheet.map((row) => {
    return row.map((cell) => String(cell ?? ""));
  });
  return parseImportRows(rows);
}
