export function formatOrderNumber(year: number, sequenceNumber: number) {
  return `RF-${year}-${String(sequenceNumber).padStart(3, "0")}`;
}
