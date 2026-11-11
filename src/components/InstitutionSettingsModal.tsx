import React, { useState } from 'react';
import { X, School, CheckCircle2 } from 'lucide-react';
import { InstitutionInfo } from '../utils/excelExporter';

interface InstitutionSettingsModalProps {
  isOpen: boolean;
  institution: InstitutionInfo;
  onClose: () => void;
  onSave: (info: InstitutionInfo) => void;
}

export const InstitutionSettingsModal: React.FC<InstitutionSettingsModalProps> = ({
  isOpen,
  institution,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<InstitutionInfo>({ ...institution });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Identitas SKPD &amp; Pejabat Penandatangan KIB</h3>
              <p className="text-xs text-slate-400">Format Resmi Lampiran Permendagri No. 19/2016</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Nama Satuan Pendidikan / Unit Kerja (SKPD)
            </label>
            <input
              type="text"
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Kepala SKPD / Sekolah</label>
              <input
                type="text"
                value={form.headmasterName}
                onChange={(e) => setForm({ ...form, headmasterName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={form.headmasterNip}
                onChange={(e) => setForm({ ...form, headmasterNip: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Pengurus Barang / Pengelola Aset
              </label>
              <input
                type="text"
                value={form.officerName}
                onChange={(e) => setForm({ ...form, officerName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">NIP Pengurus Barang</label>
              <input
                type="text"
                value={form.officerNip}
                onChange={(e) => setForm({ ...form, officerNip: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Kota &amp; Tanggal Pembuatan Dokumen</label>
            <input
              type="text"
              value={form.cityDate}
              onChange={(e) => setForm({ ...form, cityDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Simpan Identitas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
