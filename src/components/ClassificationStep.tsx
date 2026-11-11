import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { InventoryItem, KIBCategory } from '../types/inventory';
import { KIB_CATEGORY_META } from '../utils/classifier';

interface ClassificationStepProps {
  items: InventoryItem[];
  onUpdateCategory: (itemId: string, newCategory: KIBCategory, reason: string) => void;
  onProceed: () => void;
  onViewItemDetail: (item: InventoryItem) => void;
}

export const ClassificationStep: React.FC<ClassificationStepProps> = ({
  items,
  onUpdateCategory,
  onProceed,
  onViewItemDetail,
}) => {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<KIBCategory | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [isAiClassifying, setIsAiClassifying] = useState(false);

  const categoriesList: KIBCategory[] = [
    'KIB_A',
    'KIB_B',
    'KIB_C',
    'KIB_D',
    'KIB_E',
    'KIB_F',
    'NON_KAPITALISASI',
  ];

  const filteredItems = items.filter((item) => {
    const matchCat = selectedCategoryTab === 'ALL' || item.category === selectedCategoryTab;
    const matchSearch =
      search === '' ||
      item.rawName.toLowerCase().includes(search.toLowerCase()) ||
      item.classificationReason.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAiConsult = async (item: InventoryItem) => {
    setIsAiClassifying(true);
    try {
      const res = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: item.rawName,
          rawText: item.sizeSpec || item.brandModel || '',
          location: item.location,
          purchaseDate: item.purchaseDateRaw,
          unit: item.unit,
          quantity: item.quantity,
        }),
      });

      if (!res.ok) throw new Error('AI consultation error');
      const data = await res.json();
      if (data.category && data.category !== item.category) {
        onUpdateCategory(
          item.id,
          data.category as KIBCategory,
          `Rekomendasi AI Auditor: ${data.reason || 'Kesesuaian fungsi aset'}`
        );
      }
    } catch (err) {
      console.warn('AI fallback, keeping deterministic rule:', err);
    } finally {
      setIsAiClassifying(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Tahap 3: Klasifikasi Otomatis Berdasarkan Karakteristik &amp; Regulasi BMD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Penempatan Barang ke Lembar KIB Resmi
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Sistem menganalisis substansi fisik, fungsi aset, dan kriteria kapitalisasi sesuai Permendagri No. 19/2016.
          Buku masuk ke KIB E, mebeler dan elektronik masuk ke KIB B, serta barang habis pakai masuk ke Non-Kapitalisasi.
        </p>
      </div>

      {/* Category Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {categoriesList.map((catKey) => {
          const meta = KIB_CATEGORY_META[catKey];
          const count = items.filter((i) => i.category === catKey).length;
          const isSelected = selectedCategoryTab === catKey;

          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategoryTab(isSelected ? 'ALL' : catKey)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 shadow-2xs'
              }`}
            >
              <div>
                <div
                  className={`text-[11px] font-extrabold uppercase tracking-wide truncate ${
                    isSelected ? 'text-amber-400' : meta.color
                  }`}
                >
                  {meta.short}
                </div>
                <div className="text-2xl font-black mt-1">{count}</div>
              </div>
              <div
                className={`text-[10px] mt-2 truncate ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {catKey === 'NON_KAPITALISASI' ? '&lt; Rp 300rb' : 'Aset Tetap'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Item Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800">
              Menampilkan {filteredItems.length} barang pada:
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {selectedCategoryTab === 'ALL'
                ? 'Seluruh Kategori KIB'
                : KIB_CATEGORY_META[selectedCategoryTab].label}
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama barang atau pertimbangan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs px-3 py-2 pl-8 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-full sm:w-64 bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-3 w-14">No</th>
                <th className="py-3 px-3 w-20">Hal PDF</th>
                <th className="py-3 px-4">Nama Barang Asli</th>
                <th className="py-3 px-4 w-44">Klasifikasi KIB</th>
                <th className="py-3 px-4">Dasar Pertimbangan Administratif</th>
                <th className="py-3 px-3 w-28 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, idx) => {
                const meta = KIB_CATEGORY_META[item.category];

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-blue-700">
                      Hal. {item.pageNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.rawName}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.quantity} {item.unit} • {item.fundingSource} • {item.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.category}
                        onChange={(e) =>
                          onUpdateCategory(
                            item.id,
                            e.target.value as KIBCategory,
                            'Penyesuaian manual oleh pengguna'
                          )
                        }
                        className={`text-xs font-semibold px-2 py-1.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-hidden w-full ${meta.badgeBg}`}
                      >
                        {categoriesList.map((c) => (
                          <option key={c} value={c}>
                            {KIB_CATEGORY_META[c].short}
                          </option>
                        ))}
                      </select>
                      {item.isUserModifiedCategory && (
                        <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                          ✓ Disesuaikan Pengguna
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 leading-relaxed max-w-md">
                      <p className="line-clamp-2 hover:line-clamp-none transition-all">
                        {item.classificationReason}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onViewItemDetail(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition"
                          title="Lihat Detail & Jejak Audit"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAiConsult(item)}
                          disabled={isAiClassifying}
                          className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition"
                          title="Tinjau Ulang dengan Gemini AI"
                        >
                          <Sparkles className="w-4 h-4" />
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

      {/* Bottom CTA */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Setiap barang memiliki dasar pertimbangan audit yang transparan.</span>
        </div>
        <button
          onClick={onProceed}
          className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 hover:translate-x-0.5"
        >
          <span>Lanjutkan ke Format Template KIB (Tahap 4)</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
