const spreadsheetNamespace = "urn:schemas-microsoft-com:office:spreadsheet";
const maxRows = 65_536;
const maxColumns = 256;

function spreadsheetChildren(element: Element, name: string) {
  return Array.from(element.children).filter(
    (child) =>
      child.namespaceURI === spreadsheetNamespace && child.localName === name,
  );
}

function readPosition(element: Element, attribute: string, fallback: number) {
  const value = element.getAttributeNS(spreadsheetNamespace, attribute);
  const position = value === null ? fallback : Number(value);

  if (!Number.isSafeInteger(position) || position < fallback) {
    throw new Error("Invalid XML spreadsheet position.");
  }

  return position;
}

export function readExcelXmlRows(bytes: Uint8Array): string[][] | undefined {
  const bom = (bytes[0] << 8) | bytes[1];
  const encoding =
    bom === 0xfffe ? "utf-16le" : bom === 0xfeff ? "utf-16be" : "utf-8";
  const text = new TextDecoder(encoding).decode(bytes);

  if (/<!DOCTYPE/i.test(text)) {
    return undefined;
  }

  const { documentElement: workbook } = new DOMParser().parseFromString(
    text,
    "application/xml",
  );
  if (
    workbook.namespaceURI !== spreadsheetNamespace ||
    workbook.localName !== "Workbook" ||
    workbook.getElementsByTagNameNS(
      "http://www.mozilla.org/newlayout/xml/parsererror.xml",
      "parsererror",
    ).length > 0
  ) {
    return undefined;
  }

  const [worksheet] = spreadsheetChildren(workbook, "Worksheet");
  const [table] = worksheet ? spreadsheetChildren(worksheet, "Table") : [];
  if (!table) {
    return [];
  }

  const top = readPosition(table, "TopCell", 1) - 1;
  const left = readPosition(table, "LeftCell", 1) - 1;
  const rows: string[][] = [];
  let nextRow = 1;

  for (const xmlRow of spreadsheetChildren(table, "Row")) {
    const rowNumber = readPosition(xmlRow, "Index", nextRow);
    if (top + rowNumber > maxRows) {
      throw new Error("XML spreadsheet row exceeds the worksheet bounds.");
    }

    const row: string[] = [];
    let nextColumn = 1;
    for (const cell of spreadsheetChildren(xmlRow, "Cell")) {
      const columnNumber = readPosition(cell, "Index", nextColumn);
      const mergeAcross = readPosition(cell, "MergeAcross", 0);
      if (left + columnNumber + mergeAcross > maxColumns) {
        throw new Error("XML spreadsheet column exceeds the worksheet bounds.");
      }

      const [data] = spreadsheetChildren(cell, "Data");
      if (data && !cell.hasAttributeNS(spreadsheetNamespace, "Formula")) {
        row[left + columnNumber - 1] = data.textContent ?? "";
      }
      nextColumn = columnNumber + mergeAcross + 1;
    }

    while (rows.length < top + rowNumber - 1) {
      rows.push([]);
    }
    rows.push(row);
    nextRow = rowNumber + 1;
  }

  return rows;
}
