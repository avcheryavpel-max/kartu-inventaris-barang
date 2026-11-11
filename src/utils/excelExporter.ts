import ExcelJS from 'exceljs';
import { InventoryItem, ValidationSummary } from '../types/inventory';

export interface InstitutionInfo {
  schoolName: string;
  headmasterName: string;
  headmasterNip: string;
  officerName: string;
  officerNip: string;
  cityDate: string;
}

export const DEFAULT_INSTITUTION: InstitutionInfo = {
  schoolName: 'SMAS TUNAS BARU JIN SEUNG BATAM',
  headmasterName: 'Sabam Sitinjak, S.Th',
  headmasterNip: '-',
  officerName: 'Jonas Simanjuntak, S.Si',
  officerNip: '-',
  cityDate: 'Batam, 10 November 2026',
};

// Styling Constants
const NAVY_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E293B' },
};

const HEADER_FONT: Partial<ExcelJS.Font> = {
  name: 'Calibri',
  size: 10,
  bold: true,
  color: { argb: 'FFFFFFFF' },
};

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
};

function addSignatureBlock(
  ws: ExcelJS.Worksheet,
  startRow: number,
  inst: InstitutionInfo,
  totalCols: number
) {
  const rowDate = ws.getRow(startRow + 1);
  const rightCol = Math.max(8, totalCols - 2);

  rowDate.getCell(rightCol).value = inst.cityDate;
  rowDate.getCell(rightCol).font = { bold: false, italic: true };

  const rowRoles = ws.getRow(startRow + 2);
  rowRoles.getCell(2).value = 'Mengetahui,';
  rowRoles.getCell(rightCol).value = 'Pengurus Barang / Pengelola Sarpras,';

  const rowHead = ws.getRow(startRow + 3);
  rowHead.getCell(2).value = 'Kepala SMAS Tunas Baru Jin Seung';
  rowHead.getCell(rightCol).value = 'Waka Sarana Prasarana';

  const rowNames = ws.getRow(startRow + 7);
  rowNames.getCell(2).value = `( ${inst.headmasterName} )`;
  rowNames.getCell(2).font = { bold: true };
  rowNames.getCell(rightCol).value = `( ${inst.officerName} )`;
  rowNames.getCell(rightCol).font = { bold: true };

  const rowNip = ws.getRow(startRow + 8);
  rowNip.getCell(2).value = `NIP: ${inst.headmasterNip}`;
  rowNip.getCell(rightCol).value = `NIP: ${inst.officerNip}`;
}

export async function generateMasterKIBWorkbook(
  items: InventoryItem[],
  inst: InstitutionInfo = DEFAULT_INSTITUTION
): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SMART KIB - Inventory Data Processor';
  wb.created = new Date();

  // 1. REKAPITULASI EKSEKUTIF
  const wsSummary = wb.addWorksheet('REKAPITULASI_ASET');
  buildSummarySheet(wsSummary, items, inst);

  // 2. KIB A - TANAH
  const wsA = wb.addWorksheet('KIB A - TANAH');
  buildKibASheet(wsA, items.filter((i) => i.category === 'KIB_A'), inst);

  // 3. KIB B - PERALATAN DAN MESIN
  const wsB = wb.addWorksheet('KIB B - PERALATAN & MESIN');
  buildKibBSheet(wsB, items.filter((i) => i.category === 'KIB_B'), inst);

  // 4. KIB C - BANGUNAN DAN GEDUNG
  const wsC = wb.addWorksheet('KIB C - GEDUNG & BANGUNAN');
  buildKibCSheet(wsC, items.filter((i) => i.category === 'KIB_C'), inst);

  // 5. KIB D - JALAN, IRIGASI DAN JARINGAN
  const wsD = wb.addWorksheet('KIB D - JALAN & JARINGAN');
  buildKibDSheet(wsD, items.filter((i) => i.category === 'KIB_D'), inst);

  // 6. KIB E - ASET TETAP LAINNYA
  const wsE = wb.addWorksheet('KIB E - ASET TETAP LAINNYA');
  buildKibESheet(wsE, items.filter((i) => i.category === 'KIB_E'), inst);

  // 7. KIB F - KONSTRUKSI DALAM PENGERJAAN
  const wsF = wb.addWorksheet('KIB F - KDP');
  buildKibFSheet(wsF, items.filter((i) => i.category === 'KIB_F'), inst);

  // 8. NON-KAPITALISASI (< Rp. 300.000)
  const wsNon = wb.addWorksheet('NON-KAPITALISASI (<300RB)');
  buildNonKapitalisasiSheet(wsNon, items.filter((i) => i.category === 'NON_KAPITALISASI'), inst);

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

function buildSummarySheet(
  ws: ExcelJS.Worksheet,
  items: InventoryItem[],
  inst: InstitutionInfo
) {
  ws.columns = [
    { width: 6 },
    { width: 35 },
    { width: 18 },
    { width: 22 },
    { width: 30 },
  ];

  ws.mergeCells('B2:E2');
  ws.getCell('B2').value = 'REKAPITULASI KARTU INVENTARIS BARANG (KIB)';
  ws.getCell('B2').font = { size: 14, bold: true, color: { argb: 'FF0F172A' } };

  ws.mergeCells('B3:E3');
  ws.getCell('B3').value = inst.schoolName;
  ws.getCell('B3').font = { size: 11, bold: true, color: { argb: 'FF0369A1' } };

  ws.getCell('B5').value = 'Kategori Dokumen KIB';
  ws.getCell('C5').value = 'Jumlah Aset';
  ws.getCell('D5').value = 'Total Fisik';
  ws.getCell('E5').value = 'Status Verifikasi';

  [ws.getCell('B5'), ws.getCell('C5'), ws.getCell('D5'), ws.getCell('E5')].forEach((cell) => {
    cell.fill = NAVY_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  const categories = [
    { code: 'KIB_A', label: 'KIB A – Tanah' },
    { code: 'KIB_B', label: 'KIB B – Peralatan dan Mesin' },
    { code: 'KIB_C', label: 'KIB C – Bangunan dan Gedung' },
    { code: 'KIB_D', label: 'KIB D – Jalan, Irigasi, dan Jaringan' },
    { code: 'KIB_E', label: 'KIB E – Aset Tetap Lainnya (Buku & Seni)' },
    { code: 'KIB_F', label: 'KIB F – Konstruksi Dalam Pengerjaan' },
    { code: 'NON_KAPITALISASI', label: 'Belanja Non-Kapitalisasi (< Rp. 300.000)' },
  ];

  let r = 6;
  categories.forEach((cat) => {
    const subset = items.filter((i) => i.category === cat.code);
    const sumQty = subset.reduce((acc, curr) => acc + curr.quantity, 0);

    const row = ws.getRow(r);
    row.getCell(2).value = cat.label;
    row.getCell(3).value = subset.length;
    row.getCell(4).value = `${sumQty} unit/set/eks`;
    row.getCell(5).value = subset.length > 0 ? 'Terekstraksi & Terklasifikasi' : 'Nihil di Sumber';

    [row.getCell(2), row.getCell(3), row.getCell(4), row.getCell(5)].forEach((c) => {
      c.border = THIN_BORDER;
    });
    r++;
  });

  // Total Row
  const totalRow = ws.getRow(r);
  totalRow.getCell(2).value = 'TOTAL KESELURUHAN BARANG TERDAFTAR';
  totalRow.getCell(2).font = { bold: true };
  totalRow.getCell(3).value = items.length;
  totalRow.getCell(3).font = { bold: true };
  totalRow.getCell(4).value = `${items.reduce((a, b) => a + b.quantity, 0)} total fisik`;
  totalRow.getCell(4).font = { bold: true };
  totalRow.getCell(5).value = '100% Zero-Loss Check';
  totalRow.getCell(5).font = { bold: true, color: { argb: 'FF059669' } };
  [totalRow.getCell(2), totalRow.getCell(3), totalRow.getCell(4), totalRow.getCell(5)].forEach(
    (c) => (c.border = THIN_BORDER)
  );

  addSignatureBlock(ws, r + 3, inst, 5);
}

function buildKibBSheet(
  ws: ExcelJS.Worksheet,
  items: InventoryItem[],
  inst: InstitutionInfo
) {
  // Title
  ws.mergeCells('A2:P2');
  ws.getCell('A2').value = 'KARTU INVENTARIS BARANG';
  ws.getCell('A2').font = { size: 14, bold: true };
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A3:P3');
  ws.getCell('A3').value = 'B. PERALATAN DAN MESIN';
  ws.getCell('A3').font = { size: 12, bold: true };
  ws.getCell('A3').alignment = { horizontal: 'center' };

  // Headers (Exact match with Page 2 of Format_KIB_69eefa18.pdf)
  ws.mergeCells('A5:A6');
  ws.getCell('A5').value = 'No';

  ws.mergeCells('B5:B6');
  ws.getCell('B5').value = 'Kode Barang';

  ws.mergeCells('C5:C6');
  ws.getCell('C5').value = 'Jenis Barang / Nama Barang';

  ws.mergeCells('D5:D6');
  ws.getCell('D5').value = 'Nomor Register';

  ws.mergeCells('E5:E6');
  ws.getCell('E5').value = 'Merk / Type';

  ws.mergeCells('F5:F6');
  ws.getCell('F5').value = 'Ukuran / CC';

  ws.mergeCells('G5:G6');
  ws.getCell('G5').value = 'Bahan';

  ws.mergeCells('H5:H6');
  ws.getCell('H5').value = 'Tahun Pembelian';

  ws.mergeCells('I5:M5');
  ws.getCell('I5').value = 'Nomor';

  ws.getCell('I6').value = 'Pabrik';
  ws.getCell('J6').value = 'Rangka';
  ws.getCell('K6').value = 'Mesin';
  ws.getCell('L6').value = 'Polisi';
  ws.getCell('M6').value = 'BPKB';

  ws.mergeCells('N5:N6');
  ws.getCell('N5').value = 'Asal-usul Cara Perolehan';

  ws.mergeCells('O5:O6');
  ws.getCell('O5').value = 'Harga (Rp.)';

  ws.mergeCells('P5:P6');
  ws.getCell('P5').value = 'Keterangan';

  // Row 7: Column numbers 1-16
  const colNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const row7 = ws.getRow(7);
  colNums.forEach((n, idx) => {
    row7.getCell(idx + 1).value = n;
  });

  // Apply styling to header rows 5, 6, 7
  [5, 6, 7].forEach((rowNum) => {
    const row = ws.getRow(rowNum);
    for (let c = 1; c <= 16; c++) {
      const cell = row.getCell(c);
      cell.fill = NAVY_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = THIN_BORDER;
    }
  });

  // Data rows
  let curRow = 8;
  items.forEach((item, index) => {
    const row = ws.getRow(curRow);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.itemCode || '-';
    row.getCell(3).value = item.standardName;
    row.getCell(4).value = `'${item.registerNumber}`; // Text format to prevent scientific notation
    row.getCell(5).value = item.brandModel || '-';
    row.getCell(6).value = item.sizeSpec || '-';
    row.getCell(7).value = item.material || '-';
    row.getCell(8).value = item.purchaseYear || '-';
    row.getCell(9).value = item.engineNumber || '-';
    row.getCell(10).value = item.chassisNumber || '-';
    row.getCell(11).value = item.engineNumber || '-';
    row.getCell(12).value = item.policeNumber || '-';
    row.getCell(13).value = item.bpkbNumber || '-';
    row.getCell(14).value = `${item.fundingSource} (${item.quantity} ${item.unit})`;
    row.getCell(15).value = item.totalPrice !== null ? item.totalPrice : 0;
    row.getCell(15).numFmt = '#,##0.00';
    row.getCell(16).value = `Hal.${item.pageNumber} | Lok: ${item.location}${
      item.condition === 'RB' ? ` | [${item.conditionNote}]` : ''
    }`;

    for (let c = 1; c <= 16; c++) {
      row.getCell(c).border = THIN_BORDER;
    }
    curRow++;
  });

  // Total row
  const totalRow = ws.getRow(curRow);
  ws.mergeCells(`A${curRow}:N${curRow}`);
  totalRow.getCell(1).value = 'Jumlah Harga';
  totalRow.getCell(1).alignment = { horizontal: 'right' };
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(15).value = { formula: `SUM(O8:O${curRow - 1})` };
  totalRow.getCell(15).numFmt = '#,##0.00';
  totalRow.getCell(15).font = { bold: true };
  for (let c = 1; c <= 16; c++) totalRow.getCell(c).border = THIN_BORDER;

  // Signatures
  addSignatureBlock(ws, curRow + 2, inst, 16);

  // Column widths
  const widths = [5, 14, 34, 12, 18, 16, 14, 12, 12, 12, 12, 12, 12, 24, 16, 32];
  widths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });
}

function buildKibESheet(
  ws: ExcelJS.Worksheet,
  items: InventoryItem[],
  inst: InstitutionInfo
) {
  // Title
  ws.mergeCells('A2:P2');
  ws.getCell('A2').value = 'KARTU INVENTARIS BARANG';
  ws.getCell('A2').font = { size: 14, bold: true };
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A3:P3');
  ws.getCell('A3').value = 'E. ASET TETAP LAINNYA';
  ws.getCell('A3').font = { size: 12, bold: true };
  ws.getCell('A3').alignment = { horizontal: 'center' };

  // Headers (Exact match with Page 5 of Format_KIB_69eefa18.pdf)
  ws.mergeCells('A5:A6');
  ws.getCell('A5').value = 'No';

  ws.mergeCells('B5:B6');
  ws.getCell('B5').value = 'Jenis Barang / Nama Barang';

  ws.mergeCells('C5:D5');
  ws.getCell('C5').value = 'Nomor';
  ws.getCell('C6').value = 'Kode Barang';
  ws.getCell('D6').value = 'Register';

  ws.mergeCells('E5:F5');
  ws.getCell('E5').value = 'Buku / Perpustakaan';
  ws.getCell('E6').value = 'Judul / Pencipta';
  ws.getCell('F6').value = 'Spesifikasi';

  ws.mergeCells('G5:I5');
  ws.getCell('G5').value = 'Barang Bercorak Kesenian / Kebudayaan';
  ws.getCell('G6').value = 'Asal Daerah';
  ws.getCell('H6').value = 'Pencipta';
  ws.getCell('I6').value = 'Bahan';

  ws.mergeCells('J5:K5');
  ws.getCell('J5').value = 'Hewan / Ternak dan Tumbuhan';
  ws.getCell('J6').value = 'Tanggal';
  ws.getCell('K6').value = 'Nomor';

  ws.mergeCells('L5:L6');
  ws.getCell('L5').value = 'Jumlah';

  ws.mergeCells('M5:M6');
  ws.getCell('M5').value = 'Tahun Cetak / Pembelian';

  ws.mergeCells('N5:N6');
  ws.getCell('N5').value = 'Asal-usul Cara Perolehan';

  ws.mergeCells('O5:O6');
  ws.getCell('O5').value = 'Harga (Rp.)';

  ws.mergeCells('P5:P6');
  ws.getCell('P5').value = 'Keterangan';

  // Row 7: numbers 1-16
  const row7 = ws.getRow(7);
  for (let c = 1; c <= 16; c++) row7.getCell(c).value = c;

  [5, 6, 7].forEach((rowNum) => {
    const row = ws.getRow(rowNum);
    for (let c = 1; c <= 16; c++) {
      const cell = row.getCell(c);
      cell.fill = NAVY_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = THIN_BORDER;
    }
  });

  let curRow = 8;
  items.forEach((item, index) => {
    const row = ws.getRow(curRow);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.standardName;
    row.getCell(3).value = item.itemCode || '-';
    row.getCell(4).value = `'${item.registerNumber}`;
    row.getCell(5).value = item.bookTitle ? `${item.bookTitle} (${item.bookPublisher || 'Erlangga'})` : '-';
    row.getCell(6).value = item.sizeSpec || item.brandModel || '-';
    row.getCell(7).value = item.artOrigin || '-';
    row.getCell(8).value = item.artCreator || '-';
    row.getCell(9).value = item.material || '-';
    row.getCell(10).value = '-';
    row.getCell(11).value = '-';
    row.getCell(12).value = item.quantity;
    row.getCell(13).value = item.purchaseYear || '-';
    row.getCell(14).value = item.fundingSource;
    row.getCell(15).value = item.totalPrice !== null ? item.totalPrice : 0;
    row.getCell(15).numFmt = '#,##0.00';
    row.getCell(16).value = `Hal.${item.pageNumber} | Lok: ${item.location}`;

    for (let c = 1; c <= 16; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  });

  const totalRow = ws.getRow(curRow);
  ws.mergeCells(`A${curRow}:N${curRow}`);
  totalRow.getCell(1).value = 'Jumlah Harga';
  totalRow.getCell(1).alignment = { horizontal: 'right' };
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(15).value = { formula: `SUM(O8:O${curRow - 1})` };
  totalRow.getCell(15).numFmt = '#,##0.00';
  totalRow.getCell(15).font = { bold: true };
  for (let c = 1; c <= 16; c++) totalRow.getCell(c).border = THIN_BORDER;

  addSignatureBlock(ws, curRow + 2, inst, 16);

  const widths = [5, 30, 12, 10, 32, 20, 12, 14, 12, 10, 10, 10, 14, 18, 16, 28];
  widths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });
}

function buildKibASheet(
  ws: ExcelJS.Worksheet,
  items: InventoryItem[],
  inst: InstitutionInfo
) {
  ws.mergeCells('A2:N2');
  ws.getCell('A2').value = 'KARTU INVENTARIS BARANG';
  ws.getCell('A2').font = { size: 14, bold: true };
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A3:N3');
  ws.getCell('A3').value = 'A. TANAH';
  ws.getCell('A3').font = { size: 12, bold: true };
  ws.getCell('A3').alignment = { horizontal: 'center' };

  ws.mergeCells('A5:A6');
  ws.getCell('A5').value = 'No';
  ws.mergeCells('B5:B6');
  ws.getCell('B5').value = 'Jenis Barang / Nama Barang';
  ws.mergeCells('C5:D5');
  ws.getCell('C5').value = 'Nomor';
  ws.getCell('C6').value = 'Kode Barang';
  ws.getCell('D6').value = 'Register';
  ws.mergeCells('E5:E6');
  ws.getCell('E5').value = 'Luas (m2)';
  ws.mergeCells('F5:F6');
  ws.getCell('F5').value = 'Tahun Pengadaan';
  ws.mergeCells('G5:G6');
  ws.getCell('G5').value = 'Letak / Alamat';
  ws.mergeCells('H5:J5');
  ws.getCell('H5').value = 'Status Tanah';
  ws.getCell('H6').value = 'Hak';
  ws.getCell('I6').value = 'Sertifikat Tanggal';
  ws.getCell('J6').value = 'Sertifikat Nomor';
  ws.mergeCells('K5:K6');
  ws.getCell('K5').value = 'Penggunaan';
  ws.mergeCells('L5:L6');
  ws.getCell('L5').value = 'Asal-usul';
  ws.mergeCells('M5:M6');
  ws.getCell('M5').value = 'Harga (Rp.)';
  ws.mergeCells('N5:N6');
  ws.getCell('N5').value = 'Keterangan';

  const row7 = ws.getRow(7);
  for (let c = 1; c <= 14; c++) row7.getCell(c).value = c;

  [5, 6, 7].forEach((rowNum) => {
    const row = ws.getRow(rowNum);
    for (let c = 1; c <= 14; c++) {
      const cell = row.getCell(c);
      cell.fill = NAVY_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = THIN_BORDER;
    }
  });

  let curRow = 8;
  if (items.length === 0) {
    const row = ws.getRow(curRow);
    row.getCell(2).value = 'Nihil / Belum ada pencatatan tanah pada dokumen sumber';
    for (let c = 1; c <= 14; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  } else {
    items.forEach((item, index) => {
      const row = ws.getRow(curRow);
      row.getCell(1).value = index + 1;
      row.getCell(2).value = item.standardName;
      row.getCell(3).value = item.itemCode || '-';
      row.getCell(4).value = `'${item.registerNumber}`;
      row.getCell(5).value = item.areaM2 || '-';
      row.getCell(6).value = item.purchaseYear || '-';
      row.getCell(7).value = item.location;
      row.getCell(8).value = 'Hak Milik Yayasan';
      row.getCell(9).value = '-';
      row.getCell(10).value = '-';
      row.getCell(11).value = 'Kampus SMAS Tunas Baru';
      row.getCell(12).value = item.fundingSource;
      row.getCell(13).value = item.totalPrice !== null ? item.totalPrice : 0;
      row.getCell(13).numFmt = '#,##0.00';
      row.getCell(14).value = item.remarks;
      for (let c = 1; c <= 14; c++) row.getCell(c).border = THIN_BORDER;
      curRow++;
    });
  }

  const totalRow = ws.getRow(curRow);
  ws.mergeCells(`A${curRow}:L${curRow}`);
  totalRow.getCell(1).value = 'Jumlah Harga';
  totalRow.getCell(1).alignment = { horizontal: 'right' };
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(13).value = { formula: `SUM(M8:M${curRow - 1})` };
  totalRow.getCell(13).numFmt = '#,##0.00';
  totalRow.getCell(13).font = { bold: true };
  for (let c = 1; c <= 14; c++) totalRow.getCell(c).border = THIN_BORDER;

  addSignatureBlock(ws, curRow + 2, inst, 14);

  const widths = [5, 30, 12, 10, 12, 14, 25, 14, 14, 14, 20, 18, 16, 25];
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
}

function buildKibCSheet(
  ws: ExcelJS.Worksheet,
  items: InventoryItem[],
  inst: InstitutionInfo
) {
  ws.mergeCells('A2:Q2');
  ws.getCell('A2').value = 'KARTU INVENTARIS BARANG';
  ws.getCell('A2').font = { size: 14, bold: true };
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A3:Q3');
  ws.getCell('A3').value = 'C. BANGUNAN DAN GEDUNG';
  ws.getCell('A3').font = { size: 12, bold: true };
  ws.getCell('A3').alignment = { horizontal: 'center' };

  ws.mergeCells('A5:A6');
  ws.getCell('A5').value = 'No';
  ws.mergeCells('B5:B6');
  ws.getCell('B5').value = 'Jenis Barang / Nama Barang';
  ws.mergeCells('C5:D5');
  ws.getCell('C5').value = 'Nomor';
  ws.getCell('C6').value = 'Kode Barang';
  ws.getCell('D6').value = 'Register';
  ws.mergeCells('E5:E6');
  ws.getCell('E5').value = 'Kondisi Bangunan (B, KB, RB)';
  ws.mergeCells('F5:G5');
  ws.getCell('F5').value = 'Konstruksi Bangunan';
  ws.getCell('F6').value = 'Bertingkat / Tidak';
  ws.getCell('G6').value = 'Beton / Tidak';
  ws.mergeCells('H5:H6');
  ws.getCell('H5').value = 'Luas Lantai (m2)';
  ws.mergeCells('I5:I6');
  ws.getCell('I5').value = 'Letak / Alamat';
  ws.mergeCells('J5:K5');
  ws.getCell('J5').value = 'Dokumen Gedung';
  ws.getCell('J6').value = 'Tanggal';
  ws.getCell('K6').value = 'Nomor';
  ws.mergeCells('L5:L6');
  ws.getCell('L5').value = 'Luas Tanah (m2)';
  ws.mergeCells('M5:M6');
  ws.getCell('M5').value = 'Status Tanah';
  ws.mergeCells('N5:N6');
  ws.getCell('N5').value = 'Nomor Kode Tanah';
  ws.mergeCells('O5:O6');
  ws.getCell('O5').value = 'Asal-usul Tanah';
  ws.mergeCells('P5:P6');
  ws.getCell('P5').value = 'Harga (Rp.)';
  ws.mergeCells('Q5:Q6');
  ws.getCell('Q5').value = 'Keterangan';

  const row7 = ws.getRow(7);
  for (let c = 1; c <= 17; c++) row7.getCell(c).value = c;

  [5, 6, 7].forEach((rowNum) => {
    const row = ws.getRow(rowNum);
    for (let c = 1; c <= 17; c++) {
      const cell = row.getCell(c);
      cell.fill = NAVY_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = THIN_BORDER;
    }
  });

  let curRow = 8;
  items.forEach((item, index) => {
    const row = ws.getRow(curRow);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.standardName;
    row.getCell(3).value = item.itemCode || '-';
    row.getCell(4).value = `'${item.registerNumber}`;
    row.getCell(5).value = item.condition;
    row.getCell(6).value = 'Tidak';
    row.getCell(7).value = item.isConcrete ? 'Beton' : 'Baja/Aluminium';
    row.getCell(8).value = item.areaM2 || '-';
    row.getCell(9).value = item.location;
    row.getCell(10).value = item.purchaseDateRaw;
    row.getCell(11).value = '-';
    row.getCell(12).value = '-';
    row.getCell(13).value = 'Milik Yayasan';
    row.getCell(14).value = '-';
    row.getCell(15).value = item.fundingSource;
    row.getCell(16).value = item.totalPrice !== null ? item.totalPrice : 0;
    row.getCell(16).numFmt = '#,##0.00';
    row.getCell(17).value = `Hal.${item.pageNumber} | ${item.remarks}`;
    for (let c = 1; c <= 17; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  });

  const totalRow = ws.getRow(curRow);
  ws.mergeCells(`A${curRow}:O${curRow}`);
  totalRow.getCell(1).value = 'Jumlah Harga';
  totalRow.getCell(1).alignment = { horizontal: 'right' };
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(16).value = { formula: `SUM(P8:P${curRow - 1})` };
  totalRow.getCell(16).numFmt = '#,##0.00';
  totalRow.getCell(16).font = { bold: true };
  for (let c = 1; c <= 17; c++) totalRow.getCell(c).border = THIN_BORDER;

  addSignatureBlock(ws, curRow + 2, inst, 17);

  const widths = [5, 32, 12, 10, 14, 14, 14, 14, 25, 14, 14, 14, 14, 14, 18, 16, 28];
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
}

function buildKibDSheet(
  ws: ExcelJS.Worksheet,
  items: InventoryItem[],
  inst: InstitutionInfo
) {
  ws.mergeCells('A2:Q2');
  ws.getCell('A2').value = 'KARTU INVENTARIS BARANG';
  ws.getCell('A2').font = { size: 14, bold: true };
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A3:Q3');
  ws.getCell('A3').value = 'D. JALAN, IRIGASI, DAN JARINGAN';
  ws.getCell('A3').font = { size: 12, bold: true };
  ws.getCell('A3').alignment = { horizontal: 'center' };

  ws.mergeCells('A5:A6');
  ws.getCell('A5').value = 'No';
  ws.mergeCells('B5:B6');
  ws.getCell('B5').value = 'Jenis Barang / Nama Barang';
  ws.mergeCells('C5:D5');
  ws.getCell('C5').value = 'Nomor';
  ws.getCell('C6').value = 'Kode Barang';
  ws.getCell('D6').value = 'Register';
  ws.mergeCells('E5:E6');
  ws.getCell('E5').value = 'Konstruksi';
  ws.mergeCells('F5:F6');
  ws.getCell('F5').value = 'Panjang (Km)';
  ws.mergeCells('G5:G6');
  ws.getCell('G5').value = 'Lebar (m)';
  ws.mergeCells('H5:H6');
  ws.getCell('H5').value = 'Luas (m2)';
  ws.mergeCells('I5:I6');
  ws.getCell('I5').value = 'Letak / Lokasi';
  ws.mergeCells('J5:K5');
  ws.getCell('J5').value = 'Dokumen';
  ws.getCell('J6').value = 'Tanggal';
  ws.getCell('K6').value = 'Nomor';
  ws.mergeCells('L5:L6');
  ws.getCell('L5').value = 'Status Tanah';
  ws.mergeCells('M5:M6');
  ws.getCell('M5').value = 'Nomor Kode Tanah';
  ws.mergeCells('N5:N6');
  ws.getCell('N5').value = 'Asal-usul Tanah';
  ws.mergeCells('O5:O6');
  ws.getCell('O5').value = 'Harga (Rp.)';
  ws.mergeCells('P5:P6');
  ws.getCell('P5').value = 'Kondisi (B, KB, RB)';
  ws.mergeCells('Q5:Q6');
  ws.getCell('Q5').value = 'Keterangan';

  const row7 = ws.getRow(7);
  for (let c = 1; c <= 17; c++) row7.getCell(c).value = c;

  [5, 6, 7].forEach((rowNum) => {
    const row = ws.getRow(rowNum);
    for (let c = 1; c <= 17; c++) {
      const cell = row.getCell(c);
      cell.fill = NAVY_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = THIN_BORDER;
    }
  });

  let curRow = 8;
  items.forEach((item, index) => {
    const row = ws.getRow(curRow);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.standardName;
    row.getCell(3).value = item.itemCode || '-';
    row.getCell(4).value = `'${item.registerNumber}`;
    row.getCell(5).value = item.material || 'Pipa PVC / Kabel Jaringan';
    row.getCell(6).value = '-';
    row.getCell(7).value = '-';
    row.getCell(8).value = '-';
    row.getCell(9).value = item.location;
    row.getCell(10).value = item.purchaseDateRaw;
    row.getCell(11).value = '-';
    row.getCell(12).value = 'Milik Yayasan';
    row.getCell(13).value = '-';
    row.getCell(14).value = item.fundingSource;
    row.getCell(15).value = item.totalPrice !== null ? item.totalPrice : 0;
    row.getCell(15).numFmt = '#,##0.00';
    row.getCell(16).value = item.condition;
    row.getCell(17).value = `Hal.${item.pageNumber} | Jaringan Aset Sekolah`;
    for (let c = 1; c <= 17; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  });

  const totalRow = ws.getRow(curRow);
  ws.mergeCells(`A${curRow}:N${curRow}`);
  totalRow.getCell(1).value = 'Jumlah Harga';
  totalRow.getCell(1).alignment = { horizontal: 'right' };
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(15).value = { formula: `SUM(O8:O${curRow - 1})` };
  totalRow.getCell(15).numFmt = '#,##0.00';
  totalRow.getCell(15).font = { bold: true };
  for (let c = 1; c <= 17; c++) totalRow.getCell(c).border = THIN_BORDER;

  addSignatureBlock(ws, curRow + 2, inst, 17);

  const widths = [5, 32, 12, 10, 18, 12, 10, 10, 25, 14, 14, 14, 14, 18, 16, 14, 28];
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
}

function buildKibFSheet(
  ws: ExcelJS.Worksheet,
  items: InventoryItem[],
  inst: InstitutionInfo
) {
  ws.mergeCells('A2:O2');
  ws.getCell('A2').value = 'KARTU INVENTARIS BARANG';
  ws.getCell('A2').font = { size: 14, bold: true };
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A3:O3');
  ws.getCell('A3').value = 'F. KONSTRUKSI DALAM PENGERJAAN';
  ws.getCell('A3').font = { size: 12, bold: true };
  ws.getCell('A3').alignment = { horizontal: 'center' };

  ws.mergeCells('A5:A6');
  ws.getCell('A5').value = 'No';
  ws.mergeCells('B5:B6');
  ws.getCell('B5').value = 'Jenis Barang / Nama Barang';
  ws.mergeCells('C5:C6');
  ws.getCell('C5').value = 'Bangunan (P, SP, D)';
  ws.mergeCells('D5:E5');
  ws.getCell('D5').value = 'Konstruksi Bangunan';
  ws.getCell('D6').value = 'Bertingkat / Tidak bertingkat';
  ws.getCell('E6').value = 'Beton / Tidak';
  ws.mergeCells('F5:F6');
  ws.getCell('F5').value = 'Luas (m2)';
  ws.mergeCells('G5:G6');
  ws.getCell('G5').value = 'Letak / Lokasi Alamat';
  ws.mergeCells('H5:I5');
  ws.getCell('H5').value = 'Dokumen';
  ws.getCell('H6').value = 'Tanggal';
  ws.getCell('I6').value = 'Nomor';
  ws.mergeCells('J5:J6');
  ws.getCell('J5').value = 'Tgl, bulan, tahun mulai';
  ws.mergeCells('K5:K6');
  ws.getCell('K5').value = 'Status Tanah';
  ws.mergeCells('L5:L6');
  ws.getCell('L5').value = 'Nomor Kode Tanah';
  ws.mergeCells('M5:M6');
  ws.getCell('M5').value = 'Asal-usul Pembiayaan';
  ws.mergeCells('N5:N6');
  ws.getCell('N5').value = 'Nilai Kontrak (ribuan Rp)';
  ws.mergeCells('O5:O6');
  ws.getCell('O5').value = 'Keterangan';

  const row7 = ws.getRow(7);
  for (let c = 1; c <= 15; c++) row7.getCell(c).value = c;

  [5, 6, 7].forEach((rowNum) => {
    const row = ws.getRow(rowNum);
    for (let c = 1; c <= 15; c++) {
      const cell = row.getCell(c);
      cell.fill = NAVY_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = THIN_BORDER;
    }
  });

  let curRow = 8;
  if (items.length === 0) {
    const row = ws.getRow(curRow);
    row.getCell(2).value = 'Nihil proyek konstruksi yang sedang berjalan (seluruh kanopi telah selesai).';
    for (let c = 1; c <= 15; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  } else {
    items.forEach((item, index) => {
      const row = ws.getRow(curRow);
      row.getCell(1).value = index + 1;
      row.getCell(2).value = item.standardName;
      row.getCell(3).value = 'SP';
      row.getCell(4).value = 'Tidak bertingkat';
      row.getCell(5).value = 'Baja Ringan';
      row.getCell(6).value = item.areaM2 || '-';
      row.getCell(7).value = item.location;
      row.getCell(8).value = item.purchaseDateRaw;
      row.getCell(9).value = '-';
      row.getCell(10).value = item.purchaseDateRaw;
      row.getCell(11).value = 'Milik Yayasan';
      row.getCell(12).value = '-';
      row.getCell(13).value = item.fundingSource;
      row.getCell(14).value = 0;
      row.getCell(14).numFmt = '#,##0.00';
      row.getCell(15).value = `Hal.${item.pageNumber} | Pos KDP Konstruksi`;
      for (let c = 1; c <= 15; c++) row.getCell(c).border = THIN_BORDER;
      curRow++;
    });
  }

  const totalRow = ws.getRow(curRow);
  ws.mergeCells(`A${curRow}:M${curRow}`);
  totalRow.getCell(1).value = 'Jumlah Harga';
  totalRow.getCell(1).alignment = { horizontal: 'right' };
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(14).value = { formula: `SUM(N8:N${curRow - 1})` };
  totalRow.getCell(14).numFmt = '#,##0.00';
  totalRow.getCell(14).font = { bold: true };
  for (let c = 1; c <= 15; c++) totalRow.getCell(c).border = THIN_BORDER;

  addSignatureBlock(ws, curRow + 2, inst, 15);

  const widths = [5, 32, 14, 16, 14, 12, 25, 14, 14, 16, 14, 14, 18, 18, 28];
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
}

function buildNonKapitalisasiSheet(
  ws: ExcelJS.Worksheet,
  items: InventoryItem[],
  inst: InstitutionInfo
) {
  // Title matching Page 7 of Format_KIB_69eefa18.pdf
  ws.mergeCells('A2:P2');
  ws.getCell('A2').value = 'DAFTAR BELANJA BARANG YANG TIDAK DIKAPITALISASI (< Rp. 300.000,00)';
  ws.getCell('A2').font = { size: 13, bold: true };
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A5:A6');
  ws.getCell('A5').value = 'No';
  ws.mergeCells('B5:B6');
  ws.getCell('B5').value = 'Kode Barang';
  ws.mergeCells('C5:C6');
  ws.getCell('C5').value = 'Jenis Barang / Nama Barang';
  ws.mergeCells('D5:D6');
  ws.getCell('D5').value = 'Nomor Register';
  ws.mergeCells('E5:E6');
  ws.getCell('E5').value = 'Merk / Type';
  ws.mergeCells('F5:F6');
  ws.getCell('F5').value = 'Ukuran / CC';
  ws.mergeCells('G5:G6');
  ws.getCell('G5').value = 'Bahan';
  ws.mergeCells('H5:H6');
  ws.getCell('H5').value = 'Tahun Pembelian';
  ws.mergeCells('I5:M5');
  ws.getCell('I5').value = 'Nomor';
  ws.getCell('I6').value = 'Pabrik';
  ws.getCell('J6').value = 'Rangka';
  ws.getCell('K6').value = 'Mesin';
  ws.getCell('L6').value = 'Polisi';
  ws.getCell('M6').value = 'BPKB';
  ws.mergeCells('N5:N6');
  ws.getCell('N5').value = 'Asal-usul Cara Perolehan';
  ws.mergeCells('O5:O6');
  ws.getCell('O5').value = 'Harga (Rp.)';
  ws.mergeCells('P5:P6');
  ws.getCell('P5').value = 'Keterangan';

  const row7 = ws.getRow(7);
  for (let c = 1; c <= 16; c++) row7.getCell(c).value = c;

  [5, 6, 7].forEach((rowNum) => {
    const row = ws.getRow(rowNum);
    for (let c = 1; c <= 16; c++) {
      const cell = row.getCell(c);
      cell.fill = NAVY_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = THIN_BORDER;
    }
  });

  let curRow = 8;
  items.forEach((item, index) => {
    const row = ws.getRow(curRow);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.itemCode || '-';
    row.getCell(3).value = item.standardName;
    row.getCell(4).value = `'${item.registerNumber}`;
    row.getCell(5).value = item.brandModel || '-';
    row.getCell(6).value = item.sizeSpec || '-';
    row.getCell(7).value = item.material || '-';
    row.getCell(8).value = item.purchaseYear || '-';
    row.getCell(9).value = '-';
    row.getCell(10).value = '-';
    row.getCell(11).value = '-';
    row.getCell(12).value = '-';
    row.getCell(13).value = '-';
    row.getCell(14).value = `${item.fundingSource} (${item.quantity} ${item.unit})`;
    row.getCell(15).value = item.totalPrice !== null ? item.totalPrice : 0;
    row.getCell(15).numFmt = '#,##0.00';
    row.getCell(16).value = `Hal.${item.pageNumber} | Lok: ${item.location}${
      item.condition === 'RB' ? ` | [${item.conditionNote}]` : ''
    }`;

    for (let c = 1; c <= 16; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  });

  const totalRow = ws.getRow(curRow);
  ws.mergeCells(`A${curRow}:N${curRow}`);
  totalRow.getCell(1).value = 'Jumlah Harga';
  totalRow.getCell(1).alignment = { horizontal: 'right' };
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(15).value = { formula: `SUM(O8:O${curRow - 1})` };
  totalRow.getCell(15).numFmt = '#,##0.00';
  totalRow.getCell(15).font = { bold: true };
  for (let c = 1; c <= 16; c++) totalRow.getCell(c).border = THIN_BORDER;

  addSignatureBlock(ws, curRow + 2, inst, 16);

  const widths = [5, 14, 34, 12, 18, 16, 14, 12, 10, 10, 10, 10, 10, 24, 16, 30];
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
}

// 2. LAPORAN VALIDASI & AUDIT
export async function generateValidationReportWorkbook(
  summary: ValidationSummary
): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('LAPORAN_VALIDASI_AUDIT');

  ws.columns = [
    { width: 8 },
    { width: 14 },
    { width: 28 },
    { width: 14 },
    { width: 12 },
    { width: 45 },
    { width: 45 },
  ];

  ws.mergeCells('A2:G2');
  ws.getCell('A2').value = 'LAPORAN HASIL VALIDASI & INTEGRITAS DATA AUDIT KIB';
  ws.getCell('A2').font = { size: 14, bold: true, color: { argb: 'FF0F172A' } };

  ws.getCell('A4').value = `Total Barang Dievaluasi: ${summary.totalItems} baris`;
  ws.getCell('A5').value = `Indikator Kesiapan Audit: ${summary.readinessScore}% (Status: ${
    summary.readinessScore >= 80 ? 'SIAP DIPERIKSA' : 'PERLU PENYEMPURNAAN'
  })`;
  ws.getCell('A6').value = `Temuan High Severity: ${summary.highIssuesCount} | Medium: ${summary.mediumIssuesCount} | Info: ${summary.infoIssuesCount}`;

  const headers = ['No', 'ID Temuan', 'Kategori Aturan Validasi', 'Tingkat Temuan', 'Hal. PDF', 'Deskripsi Faktual', 'Rekomendasi Tindak Lanjut'];
  const row8 = ws.getRow(8);
  headers.forEach((h, idx) => {
    const c = row8.getCell(idx + 1);
    c.value = h;
    c.fill = NAVY_FILL;
    c.font = HEADER_FONT;
    c.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  let curRow = 9;
  summary.issues.forEach((iss, idx) => {
    const row = ws.getRow(curRow);
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = iss.id;
    row.getCell(3).value = iss.ruleTitle;
    row.getCell(4).value = iss.severity;
    row.getCell(4).font = {
      bold: true,
      color: {
        argb: iss.severity === 'HIGH' ? 'FFE11D48' : iss.severity === 'MEDIUM' ? 'FFD97706' : 'FF0284C7',
      },
    };
    row.getCell(5).value = iss.pageNumber ? `Hal. ${iss.pageNumber}` : '-';
    row.getCell(6).value = iss.description;
    row.getCell(7).value = iss.recommendation;

    for (let c = 1; c <= 7; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  });

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// 3. DAFTAR BARANG YANG PERLU VERIFIKASI
export async function generateVerificationListWorkbook(
  items: InventoryItem[]
): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('PERLU_VERIFIKASI');

  const pending = items.filter(
    (i) => i.verificationStatus === 'PERLU_VERIFIKASI' || i.verificationStatus === 'BERMASALAH' || i.missingFields.length > 0
  );

  ws.columns = [
    { width: 6 },
    { width: 10 },
    { width: 34 },
    { width: 14 },
    { width: 14 },
    { width: 22 },
    { width: 25 },
    { width: 35 },
  ];

  ws.mergeCells('A2:H2');
  ws.getCell('A2').value = 'DAFTAR ASET YANG MEMERLUKAN VERIFIKASI AUDITOR';
  ws.getCell('A2').font = { size: 14, bold: true };

  const headers = ['No', 'Hal. PDF', 'Nama Barang', 'Jumlah/Unit', 'Kondisi', 'Sumber Dana', 'Kolom Belum Lengkap', 'Catatan / Alasan Pemeriksaan'];
  const row4 = ws.getRow(4);
  headers.forEach((h, idx) => {
    const c = row4.getCell(idx + 1);
    c.value = h;
    c.fill = NAVY_FILL;
    c.font = HEADER_FONT;
    c.alignment = { horizontal: 'center' };
  });

  let curRow = 5;
  pending.forEach((item, idx) => {
    const row = ws.getRow(curRow);
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = item.pageNumber;
    row.getCell(3).value = item.standardName;
    row.getCell(4).value = `${item.quantity} ${item.unit}`;
    row.getCell(5).value = item.condition === 'RB' ? 'Rusak Berat (RB)' : 'Baik (B)';
    row.getCell(6).value = item.fundingSource;
    row.getCell(7).value = item.missingFields.join(', ') || '-';
    row.getCell(8).value = item.conditionNote || item.remarks;
    for (let c = 1; c <= 8; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  });

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// 4. AUDIT TRAIL PEMETAAN DARI PDF KE KIB
export async function generateAuditTrailWorkbook(
  items: InventoryItem[]
): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('AUDIT_TRAIL_TRACEABILITY');

  ws.columns = [
    { width: 6 },
    { width: 10 },
    { width: 32 },
    { width: 22 },
    { width: 14 },
    { width: 18 },
    { width: 18 },
    { width: 45 },
    { width: 20 },
  ];

  ws.mergeCells('A2:I2');
  ws.getCell('A2').value = 'MATRIKS AUDIT TRAIL: PENELUSURAN DOKUMEN PDF KE KARTU INVENTARIS BARANG';
  ws.getCell('A2').font = { size: 14, bold: true };

  const headers = ['No', 'Hal PDF', 'Nama Asli di Buku Manual', 'Klasifikasi KIB', 'Kuantitas Asli', 'Tanggal Asli', 'Lokasi Asli', 'Dasar Pertimbangan Klasifikasi (Audit Rationale)', 'Status Verifikasi'];
  const row4 = ws.getRow(4);
  headers.forEach((h, idx) => {
    const c = row4.getCell(idx + 1);
    c.value = h;
    c.fill = NAVY_FILL;
    c.font = HEADER_FONT;
    c.alignment = { horizontal: 'center' };
  });

  let curRow = 5;
  items.forEach((item, idx) => {
    const row = ws.getRow(curRow);
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = item.pageNumber;
    row.getCell(3).value = item.rawName;
    row.getCell(4).value = item.categoryLabel;
    row.getCell(5).value = `${item.quantity} ${item.unit}`;
    row.getCell(6).value = item.purchaseDateRaw;
    row.getCell(7).value = item.location;
    row.getCell(8).value = item.classificationReason;
    row.getCell(9).value = item.verificationStatus;
    for (let c = 1; c <= 9; c++) row.getCell(c).border = THIN_BORDER;
    curRow++;
  });

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
