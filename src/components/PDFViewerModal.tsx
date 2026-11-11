import React from 'react';
import { X, ChevronLeft, ChevronRight, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { OFFICIAL_DOCUMENT_NAME } from '../data/defaultInventory';

interface PDFViewerModalProps {
  pageNumber: number | null;
  allItems: InventoryItem[];
  totalPages: number;
  onClose: () => void;
  onNavigatePage: (page: number) => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  pageNumber,
  allItems,
  totalPages,
  onClose,
  onNavigatePage,
}) => {
  if (!pageNumber) return null;

  const pageItems = allItems.filter((i) => i.pageNumber === pageNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Penelusuran Halaman PDF Asli (Hal {pageNumber} dari {totalPages})
              </h3>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-sm">
                {OFFICIAL_DOCUMENT_NAME}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigatePage(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-200">
              {pageNumber} / {totalPages}
            </span>
            <button
              onClick={() => onNavigatePage(Math.min(totalPages, pageNumber + 1))}
              disabled={pageNumber >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Document Reference Notice */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-bold text-slate-900">
                Buku Inventaris SMAS Tunas Baru Jin Seung Batam
              </span>
              <p className="text-slate-500 text-[11px]">
                Format: Buku manual bergaris dengan kolom No, Nama Barang, Tanggal Pembelian, Jumlah Unit, Sumber Pendanaan, Lokasi, dan Foto Barang.
              </p>
            </div>
            <a
              href={`/assets/aistudio/${OFFICIAL_DOCUMENT_NAME}#page=${pageNumber}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100 transition flex items-center space-x-1.5 shrink-0"
            >
              <span>Buka File Asli</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* List of items on this page */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Daftar Aset Tercatat Pada Halaman {pageNumber} ({pageItems.length} Item Faktual):</span>
            </h4>

            {pageItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Tidak ada baris barang yang terdaftar di halaman ini (Halaman pembatas/pengesahan).
              </div>
            ) : (
              <div className="space-y-3">
                {pageItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        {item.rawItemNo}. {item.standardName}
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Kuantitas:</span>
                        <span className="font-bold text-slate-800">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Tanggal Beli:</span>
                        <span className="font-bold text-slate-800">{item.purchaseDateRaw}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Sumber Dana:</span>
                        <span className="font-bold text-slate-800">{item.fundingSource}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Lokasi:</span>
                        <span className="font-bold text-slate-800 truncate block">
                          {item.location}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span>Jejak: {item.remarks}</span>
                      <span className="text-emerald-700 font-medium">✓ Foto Terverifikasi</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
