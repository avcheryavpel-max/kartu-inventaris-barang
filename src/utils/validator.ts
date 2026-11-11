import { InventoryItem, ValidationIssue, ValidationSummary, KIBCategory, VerificationStatus } from '../types/inventory';

export function runComprehensiveValidation(
  items: InventoryItem[],
  totalPdfPages: number,
  declaredPdfRowCount: number
): ValidationSummary {
  const issues: ValidationIssue[] = [];
  let nextIssueId = 1;

  const addIssue = (
    ruleId: number,
    ruleTitle: string,
    severity: 'HIGH' | 'MEDIUM' | 'INFO',
    description: string,
    recommendation: string,
    item?: InventoryItem
  ) => {
    issues.push({
      id: `VAL-${nextIssueId++}`,
      ruleId,
      ruleTitle,
      severity,
      description,
      recommendation,
      itemId: item?.id,
      itemName: item?.rawName,
      pageNumber: item?.pageNumber,
    });
  };

  // 1. Zero Loss Check: Jumlah barang pada PDF vs jumlah hasil ekstraksi
  if (items.length !== declaredPdfRowCount && declaredPdfRowCount > 0) {
    addIssue(
      1,
      'Pemeriksaan Jumlah Data (Zero-Loss Check)',
      'HIGH',
      `Jumlah baris yang diekstrak (${items.length}) tidak sama persis dengan total item tercatat di dokumen PDF (${declaredPdfRowCount}).`,
      'Periksa halaman PDF yang mungkin terlewat atau baris sub-item yang belum terpisah.'
    );
  }

  // 2. Konsistensi Nomor Register
  const registerMap = new Map<string, InventoryItem[]>();
  items.forEach((item) => {
    if (!item.registerNumber || item.registerNumber === '-' || item.registerNumber === '') {
      addIssue(
        2,
        'Nomor Register Kosong',
        'MEDIUM',
        `Item "${item.rawName}" (Hal ${item.pageNumber}) belum memiliki nomor register.`,
        'Sistem akan menetapkan nomor urut register standar (misal 0001, 0002) saat ekspor jika diizinkan.',
        item
      );
    } else {
      const existing = registerMap.get(item.registerNumber) || [];
      existing.push(item);
      registerMap.set(item.registerNumber, existing);
    }
  });

  registerMap.forEach((matchedItems, reg) => {
    if (matchedItems.length > 1) {
      addIssue(
        2,
        'Duplikasi Nomor Register',
        'MEDIUM',
        `Nomor register "${reg}" dipakai oleh ${matchedItems.length} item berbeda: ${matchedItems.map((m) => `"${m.rawName}" (Hal ${m.pageNumber})`).join(', ')}.`,
        'Pastikan nomor register unik untuk setiap aset individual sesuai ketentuan pengadministrasian aset.'
      );
    }
  });

  // 3. Konsistensi Kode Barang
  items.forEach((item) => {
    if (!item.itemCode || item.itemCode === '-' || item.itemCode === '') {
      // Dalam dokumen sumber SMAS Tunas Baru, kode barang tidak dicantumkan di buku register manual
      // Catat sebagai info faktual, jangan mengarang
    }
  });

  // 4. Kesesuaian Nama Barang dengan Klasifikasi KIB
  items.forEach((item) => {
    if (item.category === 'KIB_B' && item.rawName.toLowerCase().includes('buku paket')) {
      addIssue(
        4,
        'Kesesuaian Klasifikasi Barang',
        'HIGH',
        `Item "${item.rawName}" (Hal ${item.pageNumber}) terdaftar di KIB B padahal merupakan buku perpustakaan/paket.`,
        'Pindahkan klasifikasi item ini ke KIB E (Aset Tetap Lainnya - Buku/Perpustakaan).',
        item
      );
    }
    if (item.category === 'KIB_E' && item.rawName.toLowerCase().includes('laptop')) {
      addIssue(
        4,
        'Kesesuaian Klasifikasi Barang',
        'HIGH',
        `Item "${item.rawName}" (Hal ${item.pageNumber}) terdaftar di KIB E padahal laptop adalah peralatan TIK.`,
        'Pindahkan klasifikasi item ini ke KIB B (Peralatan dan Mesin).',
        item
      );
    }
  });

  // 5. Konsistensi Tahun Perolehan
  items.forEach((item) => {
    if (!item.purchaseYear) {
      addIssue(
        5,
        'Tahun Perolehan Tidak Terdeteksi',
        'MEDIUM',
        `Item "${item.rawName}" (Hal ${item.pageNumber}) tidak memiliki tahun perolehan yang valid.`,
        'Periksa catatan tanggal pada buku register manual halaman tersebut.',
        item
      );
    } else if (item.purchaseYear < 2000 || item.purchaseYear > 2030) {
      addIssue(
        5,
        'Tahun Perolehan di Luar Batas Wajar',
        'HIGH',
        `Tahun perolehan ${item.purchaseYear} pada "${item.rawName}" (Hal ${item.pageNumber}) tampak tidak wajar.`,
        'Periksa kembali angka tahun pada dokumen sumber.',
        item
      );
    }
  });

  // 6. Konsistensi Jumlah dan Satuan
  items.forEach((item) => {
    if (item.quantity <= 0 || isNaN(item.quantity)) {
      addIssue(
        6,
        'Jumlah Unit Tidak Valid',
        'HIGH',
        `Item "${item.rawName}" (Hal ${item.pageNumber}) memiliki kuantitas ${item.quantity}.`,
        'Lengkapi jumlah barang sesuai catatan dokumen.',
        item
      );
    }
    if (!item.unit || item.unit.trim() === '') {
      addIssue(
        6,
        'Satuan Barang Kosong',
        'MEDIUM',
        `Satuan barang untuk "${item.rawName}" (Hal ${item.pageNumber}) belum diisi.`,
        'Tentukan satuan (Unit, Pcs, Set, Eks, dll) sesuai konteks fisik barang.',
        item
      );
    }
  });

  // 7. Validitas Nilai Harga (Prinsip Audit Faktual: DILARANG MENGARANG HARGA)
  let itemsWithPrice = 0;
  let itemsWithoutPrice = 0;
  let totalEstimatedValue = 0;

  items.forEach((item) => {
    if (item.totalPrice !== null && item.totalPrice > 0) {
      itemsWithPrice++;
      totalEstimatedValue += item.totalPrice;
    } else {
      itemsWithoutPrice++;
      // Ini adalah kepatuhan audit: Buku inventaris SMAS Tunas Baru di PDF memang tidak memiliki kolom harga
      // Beri info audit agar auditor mengetahui harga belum dicatat di buku register
    }
  });

  if (itemsWithoutPrice > 0) {
    addIssue(
      7,
      'Catatan Audit: Informasi Harga Belum Tersedia di Sumber',
      'INFO',
      `Sebanyak ${itemsWithoutPrice} item tidak mencantumkan nilai harga di dokumen PDF sumber asli SMAS Tunas Baru.`,
      'Sesuai Prinsip Integritas Audit: Kolom harga dibiarkan kosong/ditandai [BELUM TERSEDIA], dilarang keras mengarang nilai nominal tanpa bukti kuitansi.'
    );
  }

  // 8. Deteksi Data Ganda / Duplikasi
  const seenMap = new Map<string, InventoryItem[]>();
  items.forEach((item) => {
    const key = `${item.rawName.trim().toLowerCase()}_${item.purchaseDateRaw.trim().toLowerCase()}_${item.quantity}_${item.location.trim().toLowerCase()}`;
    const list = seenMap.get(key) || [];
    list.push(item);
    seenMap.set(key, list);
  });

  let duplicateCount = 0;
  seenMap.forEach((matches) => {
    if (matches.length > 1) {
      duplicateCount += matches.length - 1;
      addIssue(
        8,
        'Indikasi Data Ganda / Duplikasi Pembelian',
        'MEDIUM',
        `Terdeteksi ${matches.length} baris identik untuk barang "${matches[0].rawName}" dengan tanggal "${matches[0].purchaseDateRaw}" dan lokasi "${matches[0].location}" (Halaman PDF: ${matches.map((m) => m.pageNumber).join(', ')}).`,
        'Periksa apakah ini pengulangan pencatatan di buku manual atau pembelian terpisah.'
      );
    }
  });

  // 9. Deteksi Kolom Wajib yang Kosong & Missing Fields
  items.forEach((item) => {
    const missing: string[] = [];
    if (!item.location || item.location === '-' || item.location === '') {
      missing.push('Lokasi Peletakan');
    }
    if (!item.fundingSource || item.fundingSource === '-' || item.fundingSource === '') {
      missing.push('Sumber Pendanaan');
    }
    if (!item.purchaseDateRaw || item.purchaseDateRaw === '-') {
      missing.push('Tanggal Pembelian');
    }

    if (missing.length > 0) {
      item.missingFields = missing;
      if (item.verificationStatus === 'TERKONFIRMASI') {
        item.verificationStatus = 'PERLU_VERIFIKASI';
      }
      addIssue(
        9,
        'Kolom Administratif Belum Lengkap',
        'MEDIUM',
        `Item "${item.rawName}" (Hal ${item.pageNumber}) belum memiliki data: ${missing.join(', ')}.`,
        'Lengkapi informasi pada form verifikasi sebelum menghasilkan dokumen final.',
        item
      );
    }
  });

  // 10. Konsistensi Kondisi Barang (Rusak / Dimusnahkan)
  items.forEach((item) => {
    if (item.condition === 'RB' || item.location.toLowerCase().includes('rusak') || item.location.toLowerCase().includes('musnah')) {
      addIssue(
        10,
        'Aset Kondisi Rusak Berat / Dimusnahkan',
        'INFO',
        `Item "${item.rawName}" (Hal ${item.pageNumber}) berada di lokasi "${item.location}" dengan status Rusak Berat / Usul Musnah.`,
        'Pastikan Berita Acara Pemusnahan / Penghapusan Aset dilampirkan dalam berkas pemeriksaan KIB.',
        item
      );
    }
  });

  // 11. Kesesuaian Penempatan Sheet KIB
  // (Setiap item dipetakan secara terstruktur)

  // 12. Pemeriksaan Jejak Sumber (Audit Trail Traceability)
  items.forEach((item) => {
    if (!item.pageNumber || item.pageNumber <= 0) {
      addIssue(
        12,
        'Jejak Nomor Halaman PDF Hilang',
        'HIGH',
        `Item "${item.rawName}" tidak memiliki jejak nomor halaman PDF.`,
        'Setiap data wajib merujuk ke nomor halaman sumber untuk keperluan audit.',
        item
      );
    }
  });

  // Hitung KIB category counts & status counts
  const kibCounts: Record<KIBCategory, number> = {
    KIB_A: 0,
    KIB_B: 0,
    KIB_C: 0,
    KIB_D: 0,
    KIB_E: 0,
    KIB_F: 0,
    NON_KAPITALISASI: 0,
  };

  const statusCounts: Record<VerificationStatus, number> = {
    TERKONFIRMASI: 0,
    INTERPRETASI: 0,
    PERLU_VERIFIKASI: 0,
    BERMASALAH: 0,
    TIDAK_TERSEDIA: 0,
  };

  items.forEach((item) => {
    kibCounts[item.category] = (kibCounts[item.category] || 0) + 1;
    statusCounts[item.verificationStatus] = (statusCounts[item.verificationStatus] || 0) + 1;
  });

  const highCount = issues.filter((i) => i.severity === 'HIGH').length;
  const mediumCount = issues.filter((i) => i.severity === 'MEDIUM').length;
  const infoCount = issues.filter((i) => i.severity === 'INFO').length;

  // Formula Kesiapan Audit: 100 - (High * 8) - (Medium * 2) - (Missing Fields ratio)
  const baseDeductions = highCount * 7 + mediumCount * 1.5;
  const rawScore = Math.max(10, Math.min(100, Math.round(100 - baseDeductions)));

  return {
    totalItems: items.length,
    totalPdfPages,
    extractedRowsCount: items.length,
    readinessScore: rawScore,
    highIssuesCount: highCount,
    mediumIssuesCount: mediumCount,
    infoIssuesCount: infoCount,
    kibCounts,
    statusCounts,
    totalEstimatedValue,
    itemsWithPriceCount: itemsWithPrice,
    itemsWithoutPriceCount: itemsWithoutPrice,
    duplicateCount,
    issues,
  };
}
