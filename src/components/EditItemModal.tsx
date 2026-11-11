import React, { useState } from 'react';
import { X, Edit3, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { InventoryItem, KIBCategory, ConditionType } from '../types/inventory';
import { KIB_CATEGORY_META } from '../utils/classifier';

interface EditItemModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (updatedItem: InventoryItem, changeReason: string) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  onClose,
  onSave,
}) => {
  if (!item) return null;

  const [name, setName] = useState(item.standardName);
  const [category, setCategory] = useState<KIBCategory>(item.category);
  const [qty, setQty] = useState(item.quantity);
  const [unit, setUnit] = useState(item.unit);
  const [dateStr, setDateStr] = useState(item.purchaseDateRaw);
  const [year, setYear] = useState(item.purchaseYear || 2024);
  const [funding, setFunding] = useState(item.fundingSource);
  const [location, setLocation] = useState(item.location);
  const [condition, setCondition] = useState<ConditionType>(item.condition);
  const [conditionNote, setConditionNote] = useState(item.conditionNote || '');
  const [brand, setBrand] = useState(item.brandModel || '');
  const [spec, setSpec] = useState(item.sizeSpec || '');
  const [material, setMaterial] = useState(item.material || '');

  // Audit compliance: Mandatory reason
  const [changeReason, setChangeReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeReason.trim()) {
      setErrorMsg('Alasan perubahan wajib diisi untuk kepatuhan audit trail.');
      return;
    }

    const updated: InventoryItem = {
      ...item,
      standardName: name.trim(),
      category,
      categoryLabel: KIB_CATEGORY_META[category].label,
      isUserModifiedCategory: category !== item.category || item.isUserModifiedCategory,
      quantity: Number(qty) || 1,
      unit: unit.trim(),
      purchaseDateRaw: dateStr.trim(),
      purchaseYear: Number(year) || null,
      fundingSource: funding.trim(),
      location: location.trim(),
      condition,
      conditionNote: conditionNote.trim(),
      brandModel: brand.trim(),
      sizeSpec: spec.trim(),
      material: material.trim(),
      verificationStatus: condition === 'RB' ? 'PERLU_VERIFIKASI' : 'TERKONFIRMASI',
    };

    onSave(updated, changeReason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Koreksi Data Aset (Audit Trail Active)</h3>
              <p className="text-xs text-slate-400">
                Dokumen: Hal {item.pageNumber} No. {item.rawItemNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-xl flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Nama Barang Baku / Standar
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Klasifikasi KIB</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as KIBCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="KIB_A">KIB A – Tanah</option>
                <option value="KIB_B">KIB B – Peralatan dan Mesin</option>
                <option value="KIB_C">KIB C – Bangunan dan Gedung</option>
                <option value="KIB_D">KIB D – Jalan, Irigasi, dan Jaringan</option>
                <option value="KIB_E">KIB E – Aset Tetap Lainnya (Buku/Seni)</option>
                <option value="KIB_F">KIB F – Konstruksi Dalam Pengerjaan</option>
                <option value="NON_KAPITALISASI">Belanja Non-Kapitalisasi (&lt; Rp 300rb)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Kondisi Barang</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="B">Baik (B)</option>
                <option value="KB">Kurang Baik (KB)</option>
                <option value="RB">Rusak Berat / Musnah (RB)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Jumlah</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Satuan</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tahun Perolehan</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Sumber Pendanaan</label>
              <input
                type="text"
                value={funding}
                onChange={(e) => setFunding(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Lokasi Peletakan</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Merk / Tipe</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ukuran / Spesifikasi</label>
              <input
                type="text"
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Bahan / Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mandatory Reason */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-900 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Alasan Perubahan (Wajib untuk Kepatuhan Audit Trail)</span>
            </div>
            <textarea
              rows={2}
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="Contoh: Menyesuaikan klasifikasi buku paket Erlangga dari KIB B ke KIB E sesuai karakteristik perpustakaan"
              className="w-full p-2.5 rounded-lg border border-amber-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs text-slate-800"
              required
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Perubahan &amp; Catat Audit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
