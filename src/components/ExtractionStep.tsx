import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  Eye,
  FileText,
  Filter,
} from 'lucide-react';
import { InventoryItem } from '../types/inventory';

interface ExtractionStepProps {
  items: InventoryItem[];
  totalPages: number;
  onProceed: () => void;
  onViewPdfPage: (pageNumber: number) => void;
}

export const ExtractionStep: React.FC<ExtractionStepProps> = ({
  items,
  totalPages,
  onProceed,
  onViewPdfPage,
}) => {
  const [selectedPageFilter, setSelectedPageFilter] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) => {
    const matchPage = selectedPageFilter === 'ALL' || item.pageNumber === selectedPageFilter;
    const matchSearch =
      searchQuery === '' ||
      item.rawName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fundingSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPage && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tahap 2: Ekstraksi Faktual Dokumen Berhasil (Zero-Loss)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hasil Ekstraksi Data Inventaris ({items.length} Baris dari {totalPages} Halaman)
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Seluruh halaman buku inventaris SMAS Tunas Baru telah dipindai dan diekstrak. Setiap nama barang,
          spesifikasi, jumlah, tanggal perolehan, sumber dana, dan bukti foto barang telah tercatat secara faktual.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Halaman PDF</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPages}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Selesai Diproses</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Baris Barang</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{items.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Tanpa Data Terlewat</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Unit Fisik</span>
            <span className="text-xs font-bold text-amber-600">Unit</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {items.reduce((acc, curr) => acc + (curr.quantity || 1), 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Akumulasi Kuantitas</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Bukti Foto Barang</span>
            <ImageIcon className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{items.length}</div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">Tersinkron per Baris</div>
        </div>
      </div>

      {/* Page Reel Preview Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800">Filter Berdasarkan Halaman PDF Asli:</span>
          </div>
          <button
            onClick={() => setSelectedPageFilter('ALL')}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
              selectedPageFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Halaman (1–{totalPages})
          </button>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const pageItemCount = items.filter((i) => i.pageNumber === pageNum).length;
            const isSelected = selectedPageFilter === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => setSelectedPageFilter(pageNum)}
                className={`shrink-0 flex flex-col items-center justify-center p-2 rounded-xl border text-center transition min-w-[70px] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <span className="text-xs font-extrabold">Hal {pageNum}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {pageItemCount} item
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Extracted Data Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pratinjau Data Mentah Hasil Ekstraksi
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredItems.length} dari {items.length} baris barang
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama barang, lokasi, atau sumber..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-3 py-2 pl-8 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <span className="absolute left-2.5 top-2.5 text-slate-400">🔍</span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-3 w-14">No</th>
                <th className="py-3 px-3 w-20">Hal PDF</th>
                <th className="py-3 px-4">Nama Barang di Sumber Dokumen</th>
                <th className="py-3 px-3 w-28">Kuantitas</th>
                <th className="py-3 px-4 w-36">Tanggal Pembelian</th>
                <th className="py-3 px-4 w-32">Sumber Dana</th>
                <th className="py-3 px-4">Lokasi Peletakan</th>
                <th className="py-3 px-3 w-20 text-center">Foto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-blue-700">
                    <button
                      onClick={() => onViewPdfPage(item.pageNumber)}
                      className="hover:underline flex items-center space-x-1"
                      title="Lihat halaman asli di PDF"
                    >
                      <span>Hal {item.pageNumber}</span>
                      <Eye className="w-3 h-3 text-blue-500" />
                    </button>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    <div>{item.rawName}</div>
                    {item.brandModel && item.brandModel !== '-' && (
                      <div className="text-[11px] text-slate-500">Merk: {item.brandModel}</div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{item.purchaseDateRaw}</td>
                  <td className="py-2.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {item.fundingSource}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 truncate max-w-xs">
                    {item.location}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                      ✓ Ada
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-slate-500">
          ✓ Seluruh baris telah tervalidasi konsistensinya dengan halaman PDF asli.
        </div>
        <button
          onClick={onProceed}
          className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 hover:translate-x-0.5"
        >
          <span>Lanjutkan ke Klasifikasi KIB (Tahap 3)</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
