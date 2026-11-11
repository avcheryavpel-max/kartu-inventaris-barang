export type KIBCategory =
  | 'KIB_A' // Tanah
  | 'KIB_B' // Peralatan dan Mesin
  | 'KIB_C' // Gedung dan Bangunan
  | 'KIB_D' // Jalan, Irigasi, dan Jaringan
  | 'KIB_E' // Aset Tetap Lainnya (Buku, Kesenian, dll)
  | 'KIB_F' // Konstruksi Dalam Pengerjaan
  | 'NON_KAPITALISASI'; // < Rp 300.000 / Barang habis pakai / tidak dikapitalisasi

export type VerificationStatus =
  | 'TERKONFIRMASI'     // Hijau: Data terkonfirmasi dari dokumen
  | 'INTERPRETASI'      // Kuning/Biru: Data hasil interpretasi sistem
  | 'PERLU_VERIFIKASI'  // Kuning/Oranye: Perlu konfirmasi pengguna
  | 'BERMASALAH'        // Merah: Konflik / tidak konsisten / kondisi rusak berat tanpa ket.
  | 'TIDAK_TERSEDIA';   // Abu-abu: Kolom administratif belum tersedia di dokumen

export type ConditionType = 'B' | 'KB' | 'RB'; // B=Baik, KB=Kurang Baik, RB=Rusak Berat

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'EXTRACTED' | 'CLASSIFIED' | 'EDITED' | 'CONFIRMED' | 'RECLASSIFIED';
  fieldModified?: string;
  oldValue?: any;
  newValue?: any;
  reason: string;
  actor: 'SYSTEM_OCR' | 'SYSTEM_CLASSIFIER' | 'USER_AUDITOR';
}

export interface InventoryItem {
  id: string;
  pageNumber: number;
  sourceDocument: string;
  rawItemNo: string;
  rawName: string;
  standardName: string;
  category: KIBCategory;
  categoryLabel: string;
  confidence: number;
  classificationReason: string;
  isUserModifiedCategory?: boolean;

  // Tanggal & Waktu
  purchaseDateRaw: string;
  purchaseYear: number | null;
  purchaseMonth: string | null;

  // Jumlah & Satuan
  quantity: number;
  unit: string;

  // Sumber & Lokasi
  fundingSource: string;
  location: string;
  photoRef?: string;

  // Kondisi Fisik
  condition: ConditionType;
  conditionNote?: string;

  // Spesifikasi Teknis Faktual
  brandModel?: string;
  sizeSpec?: string;
  material?: string;
  engineNumber?: string; // Dilarang mengarang - jika tidak ada di dokumen isi "-"
  chassisNumber?: string;
  policeNumber?: string;
  bpkbNumber?: string;

  // Khusus KIB E (Buku / Kesenian)
  bookTitle?: string;
  bookPublisher?: string;
  artOrigin?: string;
  artCreator?: string;

  // Khusus KIB C / D / F (Bangunan, Konstruksi, Jaringan)
  areaM2?: number | null;
  constructionType?: string;
  isMultiStorey?: boolean | null;
  isConcrete?: boolean | null;

  // Keuangan (Audit Principle: FAKTA > ASUMSI. Jangan mengarang harga jika kosong di sumber)
  unitPrice: number | null;
  totalPrice: number | null;
  isPriceEstimated?: boolean;

  // Kode Barang & Register
  itemCode: string;
  registerNumber: string;

  // Keterangan & Status
  remarks: string;
  verificationStatus: VerificationStatus;
  missingFields: string[];
  auditTrail: AuditLogEntry[];
}

export interface ValidationIssue {
  id: string;
  ruleId: number;
  ruleTitle: string;
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  itemId?: string;
  itemName?: string;
  pageNumber?: number;
  description: string;
  recommendation: string;
  isResolved?: boolean;
}

export interface ValidationSummary {
  totalItems: number;
  totalPdfPages: number;
  extractedRowsCount: number;
  readinessScore: number; // 0 - 100%
  highIssuesCount: number;
  mediumIssuesCount: number;
  infoIssuesCount: number;
  kibCounts: Record<KIBCategory, number>;
  statusCounts: Record<VerificationStatus, number>;
  totalEstimatedValue: number;
  itemsWithPriceCount: number;
  itemsWithoutPriceCount: number;
  duplicateCount: number;
  issues: ValidationIssue[];
}

export interface KIBSheetDefinition {
  id: KIBCategory;
  sheetName: string;
  title: string;
  subtitle: string;
  columns: {
    key: keyof InventoryItem | string;
    header: string;
    subHeader?: string;
    colNumber: number;
    width: number;
    align?: 'left' | 'center' | 'right';
    isCurrency?: boolean;
  }[];
}
