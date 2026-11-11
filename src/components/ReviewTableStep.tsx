import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Edit3,
  Trash2,
  Eye,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  AlertOctagon,
} from 'lucide-react';
import { InventoryItem, KIBCategory, VerificationStatus, ConditionType } from '../types/inventory';
import { KIB_CATEGORY_META } from '../utils/classifier';

interface ReviewTableStepProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onViewAuditTrail: (item: InventoryItem) => void;
  onViewPdfPage: (pageNumber: number) => void;
  onBulkVerify: (itemIds: string[]) => void;
  onProceed: () => void;
}

export const ReviewTableStep: React.FC<ReviewTableStepProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onViewAuditTrail,
  onViewPdfPage,
  onBulkVerify,
  onProceed,
}) => {
  const [categoryTab, setCategoryTab] = useState<KIBCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'ALL'>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');
  const [conditionFilter, setConditionFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchCat = categoryTab === 'ALL' || item.category === categoryTab;
    const matchStatus = statusFilter === 'ALL' || item.verificationStatus === statusFilter;
    const matchYear = yearFilter === 'ALL' || (item.purchaseYear && String(item.purchaseYear) === yearFilter);
    const matchCond = conditionFilter === 'ALL' || item.condition === conditionFilter;
    const matchSearch =
      search === '' ||
      item.rawName.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.fundingSource.toLowerCase().includes(search.toLowerCase()) ||
      item.registerNumber.includes(search);

    return matchCat && matchStatus && matchYear && matchCond && matchSearch;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: VerificationStatus, cond: ConditionType) => {
    if (cond === 'RB') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-300">
          <AlertOctagon className="w-3 h-3 text-rose-600" />
          <span>Rusak/Musnah</span>
        </span>
      );
    }

    switch (status) {
      case 'TERKONFIRMASI':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Terverifikasi</span>
          </span>
        );
      case 'PERLU_VERIFIKASI':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Perlu Periksa</span>
          </span>
        );
      case 'INTERPRETASI':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-300">
            <Info className="w-3 h-3 text-blue-600" />
            <span>Sistem KIB</span>
          </span>
        );
      case 'BERMASALAH':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-300">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            <span>Bermasalah</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span>Belum Tersedia</span>
          </span>
        );
    }
  };

  const highIssueCount = items.filter(
    (i) => i.verificationStatus === 'BERMASALAH'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Tahap 6: Pemeriksaan &amp; Audit Trail Sebelum Ekspor Excel</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Tabel Review Interaktif Kartu Inventaris Barang
          </h1>
          <p className="text-xs text-slate-500">
            Periksa baris data, koreksi klasifikasi, telusuri nomor halaman PDF sumber, dan konfirmasi verifikasi.
          </p>
        </div>

        {/* Bulk Action */}
        {selectedItemIds.length > 0 && (
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 p-2.5 rounded-xl shadow-xs">
            <span className="text-xs font-bold text-amber-900">
              {selectedItemIds.length} item dipilih:
            </span>
            <button
              onClick={() => {
                onBulkVerify(selectedItemIds);
                setSelectedItemIds([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              Tandai Terverifikasi (Audit Pass)
            </button>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        <button
          onClick={() => setCategoryTab('ALL')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap ${
            categoryTab === 'ALL'
              ? 'border-blue-600 text-blue-600 bg-blue-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Semua Barang ({items.length})
        </button>

        {(
          [
            'KIB_B',
            'KIB_E',
            'KIB_C',
            'KIB_D',
            'KIB_F',
            'NON_KAPITALISASI',
          ] as KIBCategory[]
        ).map((cat) => {
          const count = items.filter((i) => i.category === cat).length;
          const meta = KIB_CATEGORY_META[cat];
          const isSelected = categoryTab === cat;

          return (
            <button
              key={cat}
              onClick={() => setCategoryTab(cat)}
              className={`px-3 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
                isSelected
                  ? 'border-blue-600 text-blue-600 bg-blue-50/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{meta.short}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Cari nama barang, register, lokasi, atau sumber..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs px-3 py-2 pl-8 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-full"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Status: Semua</option>
            <option value="TERKONFIRMASI">✓ Terverifikasi</option>
            <option value="PERLU_VERIFIKASI">⚠ Perlu Periksa</option>
            <option value="BERMASALAH">✖ Bermasalah</option>
          </select>

          {/* Tahun */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tahun: Semua</option>
            <option value="2024">Tahun 2024</option>
            <option value="2025">Tahun 2025</option>
            <option value="2026">Tahun 2026</option>
          </select>

          {/* Kondisi */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Kondisi: Semua</option>
            <option value="B">Baik (B)</option>
            <option value="KB">Kurang Baik (KB)</option>
            <option value="RB">Rusak Berat / Musnah (RB)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[580px]">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-900 text-white font-semibold sticky top-0 z-10">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredItems.length > 0 &&
                      selectedItemIds.length === filteredItems.length
                    }
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-3 w-20">Hal PDF</th>
                <th className="py-3 px-3 w-24">No Register</th>
                <th className="py-3 px-4 min-w-[220px]">Nama Barang &amp; Spesifikasi</th>
                <th className="py-3 px-3 w-32">Kategori KIB</th>
                <th className="py-3 px-3 w-24">Jumlah</th>
                <th className="py-3 px-3 w-28">Tahun/Tgl</th>
                <th className="py-3 px-3 w-32">Sumber Dana</th>
                <th className="py-3 px-4 min-w-[160px]">Lokasi</th>
                <th className="py-3 px-3 w-32">Status Audit</th>
                <th className="py-3 px-4 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, idx) => {
                const isSelected = selectedItemIds.includes(item.id);
                const kibMeta = KIB_CATEGORY_META[item.category];

                return (
                  <tr
                    key={item.id}
                    className={`transition ${
                      isSelected
                        ? 'bg-blue-50/60'
                        : item.condition === 'RB'
                        ? 'bg-rose-50/30 hover:bg-rose-50/50'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-700">
                      <button
                        onClick={() => onViewPdfPage(item.pageNumber)}
                        className="hover:underline flex items-center space-x-1"
                        title="Lihat halaman asli di PDF"
                      >
                        <span>Hal {item.pageNumber}</span>
                        <Eye className="w-3 h-3 text-blue-500" />
                      </button>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      '{item.registerNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.standardName}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.brandModel && item.brandModel !== '-' && `Merk: ${item.brandModel} • `}
                        {item.sizeSpec && item.sizeSpec !== '-' && `Spek: ${item.sizeSpec}`}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border truncate max-w-[120px] ${kibMeta.badgeBg}`}
                      >
                        {kibMeta.short}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {item.purchaseYear || item.purchaseDateRaw}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 truncate max-w-[120px]">
                        {item.fundingSource}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 truncate max-w-xs">
                      {item.location}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(item.verificationStatus, item.condition)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onViewAuditTrail(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Lihat Matriks Jejak Sumber (Audit Trail)"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                          title="Koreksi Data Item"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus Baris (Memerlukan Konfirmasi)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Deletion (Per User Request: Duplikasi hanya dihapus setelah konfirmasi) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">
                Konfirmasi Penghapusan Aset
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda akan menghapus baris barang{' '}
              <span className="font-bold text-slate-900">"{itemToDelete.rawName}"</span> (Halaman{' '}
              {itemToDelete.pageNumber}). Sesuai prinsip integritas audit, penghapusan baris harus
              memiliki dasar dokumen yang jelas agar tidak menimbulkan selisih data loss.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteItem(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition"
              >
                Ya, Konfirmasi Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Warning if Unresolved Issues Exist */}
      {highIssueCount > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-300 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Perhatian: Terdapat <span className="font-bold">{highIssueCount} barang</span> berstatus
              bermasalah / belum terkonfirmasi. Disarankan untuk memeriksa sebelum ekspor.
            </span>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-slate-500">
          ✓ Menampilkan {filteredItems.length} dari {items.length} total baris barang.
        </div>
        <button
          onClick={onProceed}
          className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 hover:translate-x-0.5"
        >
          <span>Lanjutkan ke Unduh Excel KIB (Tahap 7)</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
