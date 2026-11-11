import { InventoryItem } from '../types/inventory';
import { classifyInventoryItem } from '../utils/classifier';

export const OFFICIAL_DOCUMENT_NAME =
  'DAFTAR_INVENTARIS_BARANG_SMAS_TUNAS_BARU_JIN_SEUNG_BATAM_4db6045f.pdf';
export const OFFICIAL_TEMPLATE_NAME = 'Format_KIB_69eefa18.pdf';
export const TOTAL_OFFICIAL_PAGES = 53;

interface RawEntry {
  page: number;
  rawNo: string;
  name: string;
  date: string;
  qty: number;
  unit: string;
  source: string;
  location: string;
  brand?: string;
  spec?: string;
  material?: string;
  cond?: 'B' | 'KB' | 'RB';
  condNote?: string;
  notes?: string;
}

const rawDataset: RawEntry[] = [
  // Page 1
  { page: 1, rawNo: '1', name: 'Sofa Kulit Abu-Abu', date: '9 Januari 2024', qty: 1, unit: 'Set', source: 'Dana Kegiatan', location: 'Kantor Kepala Sekolah', material: 'Kulit Sintetis', brand: 'Custom', cond: 'B' },
  { page: 1, rawNo: '2', name: 'Biaya Pemasangan Wifi (Infrastruktur Jaringan)', date: '20 Januari 2024', qty: 2, unit: 'Titik/Unit', source: 'Dana Bos', location: 'Depan Kantor Guru Lt 1 & Depan Ruang Aula Lt 3', spec: 'Instalasi Jaringan Internet Wifi', cond: 'B' },
  { page: 1, rawNo: '3', name: 'Peralatan tukang Pemasangan Sumber Listrik Wifi (Obeng, Box Kawat, Gunting Seng, Kabel, Steker, Lakban)', date: '20 Januari 2024', qty: 1, unit: 'Set', source: 'Dana BOS', location: 'Ruang SARPRAS', spec: 'Set Perkakas Listrik & Instalasi', cond: 'B' },
  { page: 1, rawNo: '4', name: 'Rak Kartu Absensi', date: '8 Januari 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Kantor Majelis Guru Lt 1', material: 'Plastik / Besi', cond: 'B' },

  // Page 2
  { page: 2, rawNo: '5', name: 'Mesin Absensi Time Recorder Promaxi', date: '8 Januari 2024', qty: 1, unit: 'Unit', source: 'Yayasan Tunas Baru', location: 'Kantor Majelis Guru Lt 1', brand: 'Promaxi', spec: 'Model Ceklok Kartu Analog', cond: 'B' },
  { page: 2, rawNo: '6', name: 'Kotak Akrilik Penyimpanan Ponsel', date: 'Januari 2024', qty: 13, unit: 'Unit', source: 'Dana BOS', location: 'Kantor majelis guru Lt 1 dan Lt 2', material: 'Akrilik / Plastik Wadah', cond: 'B' },
  { page: 2, rawNo: '7', name: 'Dispenser Cosmos', date: 'Januari 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Kantor majelis guru Lt 1', brand: 'Cosmos', spec: 'CWD-1138P Galon Bawah/Atas', cond: 'B' },
  { page: 2, rawNo: '8', name: 'Senar Gitar Yamaha', date: '29 Januari 2024', qty: 4, unit: 'Pack/Unit', source: 'Dana Kegiatan', location: 'Lab Komputer', brand: 'Yamaha', spec: 'Klasik / Akustik', cond: 'B' },

  // Page 3
  { page: 3, rawNo: '9', name: 'Baju Seragam Ekskul Paskibra', date: 'Januari 2024', qty: 20, unit: 'Pasang', source: 'Dana Bos', location: 'Kantor Waka Kesiswaan', material: 'Kain Drill Putih', cond: 'B' },

  // Page 4 (Februari 2024)
  { page: 4, rawNo: '1', name: 'Bola Futsal Ortus Eight', date: '7 Februari 2024', qty: 10, unit: 'Buah', source: 'Dana Bos', location: 'Gudang Peralatan', brand: 'Ortus Eight', cond: 'B' },
  { page: 4, rawNo: '2', name: 'Bola Basket Molten', date: '7 Februari 2024', qty: 5, unit: 'Buah', source: 'Dana Bos', location: 'Gudang Peralatan', brand: 'Molten', cond: 'B' },
  { page: 4, rawNo: '3', name: 'Bola Voli Molten', date: '7 Februari 2024', qty: 10, unit: 'Buah', source: 'Dana Bos', location: 'Gudang Peralatan', brand: 'Molten', cond: 'B' },

  // Page 5
  { page: 5, rawNo: '4a', name: 'Raket Bulu Tangkis Yonex', date: '7 Februari 2024', qty: 10, unit: 'Unit', source: 'Dana Bos', location: 'Gudang Peralatan', brand: 'Yonex', cond: 'B' },
  { page: 5, rawNo: '4b', name: 'Kok Bulu Tangkis (Shuttlecock)', date: '7 Februari 2024', qty: 5, unit: 'Slop', source: 'Dana Bos', location: 'Gudang Peralatan', cond: 'B' },
  { page: 5, rawNo: '5', name: 'Tali Skipping Olahraga', date: '7 Februari 2024', qty: 15, unit: 'Pcs', source: 'Dana Bos', location: 'Gudang Peralatan', cond: 'B' },
  { page: 5, rawNo: '6', name: 'Kerucut Plastik Latihan Olahraga (Agility Cones)', date: '7 Februari 2024', qty: 10, unit: 'Pcs', source: 'Dana BOS', location: 'Gudang Peralatan', cond: 'B' },

  // Page 6
  { page: 6, rawNo: '7', name: 'Paket Alat & Cairan Pembersih Kebersihan (Sunlight, So Klin Lantai, Hit, Baygon, Sabun Cuci Tangan, Vixal)', date: '7 Februari 2024', qty: 1, unit: 'Paket', source: 'Dana Bos', location: 'Gudang Kebersihan', spec: 'Bahan Habis Pakai Kebersihan', cond: 'B' },

  // Page 7
  { page: 7, rawNo: '8', name: 'Kamera DSLR Canon EOS 7D', date: '7 Februari 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Kantor Sarana Prasarana', brand: 'Canon', spec: 'EOS 7D + Lensa Kit + Tas Kamera', cond: 'B' },
  { page: 7, rawNo: '9', name: 'Printer Epson EcoTank L5290 (All-in-One Fax & ADF)', date: '7 Februari 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Kantor Kepala Sekolah', brand: 'Epson', spec: 'EcoTank L5290 WiFi Multifungsi', cond: 'B' },

  // Page 8
  { page: 8, rawNo: '10', name: 'Laptop ASUS VivoBook', date: '7 Februari 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Kantor Kepala Sekolah', brand: 'ASUS', spec: 'VivoBook 14/15 inch', cond: 'B' },
  { page: 8, rawNo: '11', name: 'Kipas Angin Plafon KDK W256P', date: '22 Februari 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Kelas XI IPS 1 (2024)', brand: 'KDK', spec: 'Model W256P Ceilling Fan', cond: 'B' },

  // Page 9 (April 2024)
  { page: 9, rawNo: '1', name: 'Dispenser Air Minum Cosmos CWD', date: '24 April 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Ruang UKS', brand: 'Cosmos', spec: 'CWD-1138P Ungu/Putih', cond: 'B' },
  { page: 9, rawNo: '2', name: 'Laptop ASUS VivoBook (PJ Ibu Sartika Siringoringo, S.Pd)', date: '17 April 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Kantor Guru Lt 1', brand: 'ASUS', spec: 'VivoBook Core i3/i5', notes: 'Ditanggung jawabi oleh Ibu Sartika Siringoringo, S.Pd', cond: 'B' },

  // Page 10
  { page: 10, rawNo: '3', name: 'Sapu Lidi Kebersihan', date: '24 April 2024', qty: 20, unit: 'Batang', source: 'Dana BOS', location: 'Halaman Sekolah dan Gudang', cond: 'B' },
  { page: 10, rawNo: '4', name: 'Sapu Lantai Ijuk / Nilon', date: '24 April 2024', qty: 50, unit: 'Batang', source: 'Dana BOS', location: 'Kelas dan Gudang', cond: 'B' },
  { page: 10, rawNo: '5', name: 'Pengki Sampah Plastik', date: '24 April 2024', qty: 20, unit: 'Buah', source: 'Dana BOS', location: 'Kelas dan Gudang', cond: 'B' },
  { page: 10, rawNo: '6', name: 'Ember Pel Lantai', date: '24 April 2024', qty: 20, unit: 'Buah', source: 'Dana BOS', location: 'Kelas dan Gudang', cond: 'B' },
  { page: 10, rawNo: '7', name: 'Kemoceng Pembersih Debu', date: '24 April 2024', qty: 20, unit: 'Buah', source: 'Dana BOS', location: 'Kelas dan Gudang', cond: 'B' },
  { page: 10, rawNo: '8', name: 'Kain Pel Lantai Refill / Set', date: '24 April 2024', qty: 50, unit: 'Pcs', source: 'Dana BOS', location: 'Kelas dan Gudang', cond: 'B' },
  { page: 10, rawNo: '9a', name: 'Bendera Semapur Pramuka', date: '24 April 2024', qty: 6, unit: 'Pasang', source: 'Dana BOS', location: 'Ruang Osis', cond: 'B' },
  { page: 10, rawNo: '8b', name: 'Kabel Mikrofon Audio 15 Meter', date: '24 April 2024', qty: 2, unit: 'Roll/Pcs', source: 'Dana BOS', location: 'Gudang Sarpras', spec: 'Panjang 15m XLR/Jack', cond: 'B' },
  { page: 10, rawNo: '9b', name: 'Tali Tambang Pramuka', date: '24 April 2024', qty: 6, unit: 'Roll', source: 'Dana BOS', location: 'Ruang Osis', cond: 'B' },

  // Page 11
  { page: 11, rawNo: '1', name: 'Pemasangan Jaringan & Meteran PDAM SMAS Tunas Baru', date: '30 Maret 2024', qty: 1, unit: 'Unit/Paket', source: 'Yayasan Tunas Baru', location: 'Parkiran Siswa / Dekat Torren Air', spec: 'Meteran Air PDAM Baru & Sambungan', cond: 'B' },
  { page: 11, rawNo: '2', name: 'Peralatan & Bahan Pipa Penyambungan Instalasi Air (Elbow, Lem Pipa, Semen, Pahat Batu, Gunting Pipa, Batu Bata, Kunci Inggris, Lem Besi, Klem Pipa)', date: '20 April 2024', qty: 1, unit: 'Paket', source: 'Dana Kegiatan', location: 'Lab IPA (Ruang Waka Sarpras)', spec: 'Instalasi Saluran Air Bersih Gedung', cond: 'B' },

  // Page 12
  { page: 12, rawNo: '3', name: 'Kasur Medis Pasien UKS SKRIN ME', date: '17 April 2024', qty: 1, unit: 'Unit', source: 'Yayasan Tunas Baru', location: 'Ruang UKS', brand: 'SKRIN ME', spec: 'Hospital Bed Manual dengan Crank & Matras', cond: 'B' },
  { page: 12, rawNo: '4', name: 'Buku Paket "Pendidikan Pancasila" Terbitan Erlangga', date: '18 April 2024', qty: 144, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga Kurikulum Merdeka', cond: 'B' },

  // Page 13
  { page: 13, rawNo: '5', name: 'Buku Paket "IPS Ekonomi" Terbitan Erlangga', date: '18 April 2024', qty: 72, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },
  { page: 13, rawNo: '6', name: 'Buku Paket "IPS Geografi" Terbitan Erlangga', date: '18 April 2024', qty: 72, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },
  { page: 13, rawNo: '7', name: 'Buku Paket "IPS Sosiologi" Terbitan Erlangga', date: '18 April 2024', qty: 72, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },

  // Page 14
  { page: 14, rawNo: '8', name: 'Buku Paket "IPA Biologi" Terbitan Erlangga', date: '18 April 2024', qty: 72, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },
  { page: 14, rawNo: '9', name: 'Buku Paket "IPA Fisika" Terbitan Erlangga', date: '18 April 2024', qty: 72, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },
  { page: 14, rawNo: '10', name: 'Buku Paket "IPA Kimia" Terbitan Erlangga', date: '18 April 2024', qty: 72, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },

  // Page 15
  { page: 15, rawNo: '11', name: 'Buku Paket "Pathway to English" Terbitan Erlangga', date: '18 April 2024', qty: 144, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },
  { page: 15, rawNo: '12', name: 'Buku Paket "Kompeten Berbahasa Indonesia" Terbitan Erlangga', date: '18 April 2024', qty: 144, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },
  { page: 15, rawNo: '13', name: 'Buku Paket "Informatika" Terbitan Erlangga', date: '18 April 2024', qty: 144, unit: 'Eks', source: 'Dana BOS', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga SMA', cond: 'B' },

  // Page 17 (Mei 2024)
  { page: 17, rawNo: '14', name: 'Kursi Aula Merk Century 1672', date: '7 Mei 2024', qty: 130, unit: 'Unit', source: 'Yayasan Tunas Baru', location: 'Aula Sekolah Lt 3', brand: 'Century 1672', material: 'Besi & Busa Hitam', cond: 'B' },
  { page: 17, rawNo: '15', name: 'Cat Semprot Penanda Kursi Aula', date: '11 Mei 2024', qty: 2, unit: 'Kaleng/Unit', source: 'Dana Kegiatan', location: 'Lab IPA / Ruang Waka Sarpras', spec: 'Pilox / Spray Paint', cond: 'B' },
  { page: 17, rawNo: '16', name: 'Kipas Plafon Merk KDK', date: '20 April 2024', qty: 1, unit: 'Unit', source: 'Dana Kegiatan', location: 'Lantai 1 Ruang Kelas Paling Ujung', brand: 'KDK', cond: 'B' },

  // Page 18
  { page: 18, rawNo: '17', name: 'Pintu Toilet Bahan Aluminium Composite Panel (ACP)', date: '1 Juni 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Toilet Lantai 1 (Toilet Siswa Laki-Laki)', material: 'Aluminium Composite Panel', cond: 'B' },

  // Page 19 (Juli - Agustus 2024)
  { page: 19, rawNo: '1', name: 'Mimbar / Panggung Upacara Lapangan Sekolah', date: 'Juli 2024', qty: 1, unit: 'Unit', source: 'Dana BOS', location: 'Lapangan Sekolah', material: 'Cor Keramik & Semen Permanen', cond: 'B' },
  { page: 19, rawNo: '2', name: 'Bendera / Umbul-Umbul Perayaan', date: 'Agustus 2024', qty: 10, unit: 'Pcs', source: 'Dana Kegiatan', location: 'Ruang Lab IPA', cond: 'B' },
  { page: 19, rawNo: '3', name: 'Bola Lampu Brilmax', date: 'Juli 2024', qty: 6, unit: 'Pcs', source: 'Dana Kegiatan', location: 'Ruang Toilet', brand: 'Brilmax', cond: 'B' },

  // Page 20
  { page: 20, rawNo: '4', name: 'Bola Lampu Eco-link dan Bola Lampu Pikolite', date: 'Juli 2024', qty: 33, unit: 'Pcs', source: 'Dana BOS', location: 'Ruang Kelas, Kantor Guru dan Aula', brand: 'Eco-link & Pikolite', cond: 'B' },
  { page: 20, rawNo: '5a', name: 'Meja Belajar Siswa', date: 'Juli 2024', qty: 10, unit: 'Unit', source: 'Yayasan', location: 'Ruang Kelas', material: 'Kayu & Rangka Besi', cond: 'B' },
  { page: 20, rawNo: '5b', name: 'Kursi Belajar Siswa', date: 'Juli 2024', qty: 60, unit: 'Unit', source: 'Yayasan', location: 'Ruang Kelas', material: 'Besi & Busa Dudukan', cond: 'B' },
  { page: 20, rawNo: '6', name: 'Waterpas Asaki Alat Ukur Lab Sarpras', date: 'Juli 2024', qty: 1, unit: 'Buah', source: 'Dana Kegiatan', location: 'Lab IPA', brand: 'Asaki', spec: 'Tingkat Presisi Bangunan', cond: 'B' },

  // Page 21 (Agustus - September 2024)
  { page: 21, rawNo: '7', name: 'Selang Pembuangan Air AC', date: 'Agustus 2024', qty: 1, unit: 'Roll/Unit', source: 'Dana Kegiatan', location: 'Lab Komputer', cond: 'B' },
  { page: 21, rawNo: '8', name: 'Kabel HDMI High Speed', date: 'Agustus 2024', qty: 6, unit: 'Unit', source: 'Dana Kegiatan', location: 'Kelas', spec: 'Panjang 1.5 - 3 meter', cond: 'B' },
  { page: 21, rawNo: '9', name: 'Printer Canon Pixma IP8770 A3+', date: 'Agustus 2024', qty: 1, unit: 'Unit', source: 'Dana BOSP', location: 'Kantor Guru', brand: 'Canon', spec: 'Pixma IP8770 Inkjet Photo A3', cond: 'B' },
  { page: 21, rawNo: '10', name: 'Set Meja dan Kursi Kerja Kantor', date: 'September 2024', qty: 1, unit: 'Pasang', source: 'Dana BOSP', location: 'Kantor Kepala Sekolah', material: 'Kayu Solid / HPL', cond: 'B' },

  // Page 22
  { page: 22, rawNo: '11', name: 'Speaker Portable Bluetooth GMC dan ADVANCE', date: 'September 2024', qty: 6, unit: 'Unit', source: 'Dana BOSP', location: 'Laboratorium Komputer', brand: 'GMC & ADVANCE', spec: 'Speaker Trolley Portable', cond: 'B' },
  { page: 22, rawNo: '12', name: 'Splitter HDMI Switcher', date: 'September 2024', qty: 1, unit: 'Unit', source: 'Dana BOSP', location: 'Ruang Kelas XI MIPA 2', cond: 'B' },
  { page: 22, rawNo: '13', name: 'Gitar Elektrik Merk J. Guitar', date: 'September 2024', qty: 1, unit: 'Unit', source: 'Dana BOSP', location: 'Laboratorium Komputer', brand: 'J. Guitar', spec: 'Electric Solid Body Black + Gigbag', cond: 'B' },

  // Page 23
  { page: 23, rawNo: '14', name: 'Pelantang Suara Megaphone TOA ZR-2015S', date: 'September 2024', qty: 1, unit: 'Unit', source: 'Dana BOSP', location: 'Kantor Kepala Sekolah', brand: 'TOA', spec: 'Model ZR-2015S Horn Megaphone', cond: 'B' },
  { page: 23, rawNo: '15', name: 'Gitar Akustik Yamaha', date: 'Oktober 2024', qty: 5, unit: 'Unit', source: 'Dana BOSP', location: 'Laboratorium Komputer', brand: 'Yamaha', spec: 'Model C-315 / F-310 Classic', cond: 'B' },
  { page: 23, rawNo: '16', name: 'PC All in One (AIO) HP', date: 'Oktober 2024', qty: 5, unit: 'Unit', source: 'Dana BOSP', location: 'Laboratorium Komputer', brand: 'HP', spec: 'All-in-One PC 21.5-24 inch Display', cond: 'B' },

  // Page 24
  { page: 24, rawNo: '17', name: 'Drum Set Akustik Merk TORNADO by Mapex', date: 'Oktober 2024', qty: 1, unit: 'Set', source: 'Dana BOSP', location: 'Laboratorium IPA', brand: 'Tornado', spec: 'Full Set 5-piece Drum + Cymbals', cond: 'B' },
  { page: 24, rawNo: '18', name: 'AC Split Wall Merk Panasonic 2 PK', date: 'November 2024', qty: 1, unit: 'Unit', source: 'Dana BOSP', location: 'Laboratorium Komputer', brand: 'Panasonic', spec: 'Kapasitas 2 PK', cond: 'B' },
  { page: 24, rawNo: '19', name: 'Proyek Pengadaan Kanopi Halaman Sekolah (Depan Kantor Guru)', date: 'Desember 2024', qty: 1, unit: 'Unit/Konstruksi', source: 'Dana BOSP', location: 'Halaman Sekolah', spec: 'Kanopi Rangka Baja Ringan / Spandek', cond: 'B' },

  // Page 25
  { page: 25, rawNo: '20', name: 'Pompa Air Listrik SHIMIZU PS-103 BIT', date: 'September 2024', qty: 1, unit: 'Unit', source: 'Dana BOSP', location: 'Belakang Toilet Lantai 1', brand: 'Shimizu', spec: 'Model PS-103 BIT Otomatis', cond: 'B' },

  // Page 26 (Februari 2025)
  { page: 26, rawNo: '1a', name: 'Pengki Sampah Plastik', date: 'Februari 2025', qty: 25, unit: 'Buah', source: 'Dana BOSP', location: 'Ruang Kelas, Kantor Guru, Lab IPA', cond: 'B' },
  { page: 26, rawNo: '1b', name: 'Sapu Lidi', date: 'Februari 2025', qty: 25, unit: 'Batang', source: 'Dana BOSP', location: 'Ruang Kelas, Kantor Guru, Lab IPA', cond: 'B' },
  { page: 26, rawNo: '1c', name: 'Pel Lantai', date: 'Februari 2025', qty: 50, unit: 'Batang/Set', source: 'Dana BOSP', location: 'Ruang Kelas, Kantor Guru, Lab IPA', cond: 'B' },
  { page: 26, rawNo: '1d', name: 'Sapu Lantai', date: 'Februari 2025', qty: 50, unit: 'Batang', source: 'Dana BOSP', location: 'Ruang Kelas, Kantor Guru, Lab IPA', cond: 'B' },
  { page: 26, rawNo: '1e', name: 'Ember Pel Lantai', date: 'Februari 2025', qty: 20, unit: 'Buah', source: 'Dana BOSP', location: 'Ruang Kelas, Kantor Guru, Lab IPA', cond: 'B' },
  { page: 26, rawNo: '1f', name: 'Kemoceng Debu', date: 'Februari 2025', qty: 25, unit: 'Buah', source: 'Dana BOSP', location: 'Ruang Kelas, Kantor Guru, Lab IPA', cond: 'B' },
  { page: 26, rawNo: '2a', name: 'Kok Bulutangkis', date: 'Februari 2025', qty: 5, unit: 'Slop', source: 'Dana BOSP', location: 'Gudang Olahraga Lt 3, Ruang BP', cond: 'B' },
  { page: 26, rawNo: '2b', name: 'Tali Skipping', date: 'Februari 2025', qty: 20, unit: 'Pcs', source: 'Dana BOSP', location: 'Gudang Olahraga Lt 3, Ruang BP', cond: 'B' },
  { page: 26, rawNo: '2c', name: 'Bola Voli Runway/Molten', date: 'Februari 2025', qty: 5, unit: 'Buah', source: 'Dana BOSP', location: 'Gudang Olahraga Lt 3, Ruang BP', cond: 'B' },
  { page: 26, rawNo: '2d', name: 'Bola Basket Molten', date: 'Februari 2025', qty: 5, unit: 'Buah', source: 'Dana BOSP', location: 'Gudang Olahraga Lt 3, Ruang BP', cond: 'B' },
  { page: 26, rawNo: '2e', name: 'Raket Badminton', date: 'Februari 2025', qty: 10, unit: 'Buah', source: 'Dana BOSP', location: 'Gudang Olahraga Lt 3, Ruang BP', cond: 'B' },
  { page: 26, rawNo: '3', name: 'Bingkai Gambar Resmi Presiden dan Wakil Presiden RI', date: 'Februari 2025', qty: 20, unit: 'Pasang', source: 'Dana BOSP', location: 'Seluruh Ruangan SMAS Tunas Baru Jin Seung', spec: 'Pigura Bingkai Kaca Resmi Negara', cond: 'B' },

  // Page 27
  { page: 27, rawNo: '4', name: 'Hula Hup Olahraga Senam', date: 'Februari 2025', qty: 10, unit: 'Pcs', source: 'Dana BOSP', location: 'Gudang Olah Raga Lt 3', cond: 'B' },
  { page: 27, rawNo: '5a', name: 'Kabel Cok Sambung Ekstensi 3 Meter', date: 'Februari 2025', qty: 10, unit: 'Unit', source: 'Dana BOSP', location: 'Kantor Guru Lt 1 & Lt 2', spec: 'Kabel Roll 3m', cond: 'B' },
  { page: 27, rawNo: '5b', name: 'Kabel Cok Sambung Ekstensi 15 Meter', date: 'Februari 2025', qty: 2, unit: 'Unit', source: 'Dana BOSP', location: 'Kantor Guru Lt 1 & Lt 2', spec: 'Kabel Roll 15m Heavy Duty', cond: 'B' },
  { page: 27, rawNo: '6', name: 'Alat Tukang: Kapak Baja & Cangkul Blencong', date: 'Februari 2025', qty: 2, unit: 'Unit', source: 'Dana BOSP', location: 'Gudang Peralatan', spec: 'Baja Tempa Perkakas Kebun/Bangunan', cond: 'B' },

  // Page 28 (Maret 2025)
  { page: 28, rawNo: '1a', name: 'Microphone Wireless Ashley', date: 'Maret 2025', qty: 1, unit: 'Unit/Set', source: 'Dana BOSP', location: 'Lorong Lantai 1', brand: 'Ashley', spec: 'Dual Handheld Wireless Mic', cond: 'B' },
  { page: 28, rawNo: '1b', name: 'Lampu LED Merk Ecolink', date: 'Maret 2025', qty: 30, unit: 'Pcs', source: 'Dana BOSP', location: 'Kantor Guru Lt 1', brand: 'Ecolink', cond: 'B' },
  { page: 28, rawNo: '2', name: 'Paket Alat Pramuka & Kebun (Tali Kur 50, Stok 50, Cangkul 1, Sekop 1, Keran Air 1, Selang Air 12, Terpal Atap 2, Kompor Gas 2 Tungku 1, Teflon 1)', date: 'Maret 2025', qty: 119, unit: 'Item/Paket', source: 'Dana BOSP', location: 'Laboratorium IPA', cond: 'B' },
  { page: 28, rawNo: '3', name: 'Tenda Pramuka Regu Lengkap Tiang Pasak', date: 'Maret 2025', qty: 3, unit: 'Set', source: 'Dana BOSP', location: 'Laboratorium IPA', spec: 'Tenda Dome/Pleton Pramuka', cond: 'B' },

  // Page 29 (April 2025)
  { page: 29, rawNo: '1', name: 'Box File Arsip Kantor', date: 'April 2025', qty: 30, unit: 'Pcs', source: 'Dana BOSP', location: 'Kantor Guru Lt 1', material: 'Plastik / Karton Tebal', cond: 'B' },
  { page: 29, rawNo: '2a', name: 'Peta Dinding Indonesia', date: 'April 2025', qty: 1, unit: 'Pcs', source: 'Dana BOSP', location: 'Kantor Guru Lt 1', spec: 'Peta Administratif NKRI Skala Besar', cond: 'B' },
  { page: 29, rawNo: '2b', name: 'Peta Dinding Dunia', date: 'April 2025', qty: 1, unit: 'Pcs', source: 'Dana BOSP', location: 'Kantor Guru Lt 1', spec: 'Peta Geopolitik Dunia', cond: 'B' },
  { page: 29, rawNo: '3', name: 'Globe Bola Dunia Ukuran Sedang/Besar', date: 'April 2025', qty: 2, unit: 'Unit', source: 'Dana BOSP', location: 'Kantor Guru Lt 1', spec: 'Globe Dudukan Rotasi', cond: 'B' },

  // Page 30
  { page: 30, rawNo: '4', name: 'Atlas Indonesia & Dunia', date: 'April 2025', qty: 5, unit: 'Eks', source: 'Dana BOSP', location: 'Kantor Guru / Perpustakaan', spec: 'Atlas Geografi Edisi Lengkap', cond: 'B' },
  { page: 30, rawNo: '5', name: 'Komparator Batuan Geologi (Spesimen Batuan Lab)', date: 'April 2025', qty: 3, unit: 'Set', source: 'Dana BOSP', location: 'Laboratorium IPA', spec: 'Koleksi Batuan Beku, Sedimen, Metamorf', cond: 'B' },

  // Page 31 (Mei - Juni 2025)
  { page: 31, rawNo: '1', name: 'UPS Uninterruptible Power Supply ICA 1200 VA', date: 'Mei 2025', qty: 1, unit: 'Unit', source: 'Dana BOSP', location: 'Lab Komputer', brand: 'ICA', spec: 'Kapasitas 1200 VA Stabilizer', cond: 'B' },
  { page: 31, rawNo: '2', name: 'Set Meja & Kursi Belajar Siswa', date: 'Juni 2025', qty: 30, unit: 'Set', source: 'Dana BOSP', location: 'Kelas', material: 'Kayu dan Besi', cond: 'B' },

  // Page 32 (Juli 2025)
  { page: 32, rawNo: '1', name: 'Buku Paket "Matematika Tingkat Lanjut"', date: 'Juli 2025', qty: 160, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Kurikulum Merdeka SMA', cond: 'B' },
  { page: 32, rawNo: '2', name: 'Buku Paket "Kompeten Berbahasa Indonesia"', date: 'Juli 2025', qty: 160, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 32, rawNo: '3', name: 'Buku Paket "Informatika"', date: 'Juli 2025', qty: 160, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Kurikulum Merdeka', cond: 'B' },

  // Page 33
  { page: 33, rawNo: '4', name: 'Buku Paket "Pendidikan Pancasila"', date: 'Juli 2025', qty: 160, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 33, rawNo: '5', name: 'Buku Paket "Pathway to English"', date: 'Juli 2025', qty: 160, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 33, rawNo: '6', name: 'Buku Paket "Biologi"', date: 'Juli 2025', qty: 80, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },

  // Page 34
  { page: 34, rawNo: '7', name: 'Buku Paket "Kimia"', date: 'Juli 2025', qty: 80, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 34, rawNo: '8', name: 'Buku Paket "Fisika"', date: 'Juli 2025', qty: 80, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 34, rawNo: '9', name: 'Buku Paket "Geografi"', date: 'Juli 2025', qty: 80, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },

  // Page 35
  { page: 35, rawNo: '10', name: 'Buku Paket "Ekonomi"', date: 'Juli 2025', qty: 80, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 35, rawNo: '11', name: 'Buku Paket "MTK TL" (Matematika Tingkat Lanjut XI)', date: 'Juli 2025', qty: 80, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 35, rawNo: '12', name: 'Buku Paket "Sosiologi"', date: 'Juli 2025', qty: 80, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 35, rawNo: '13', name: 'Buku Paket "MTK TL" (Matematika Tingkat Lanjut XII)', date: 'Juli 2025', qty: 80, unit: 'Eks', source: 'Dana BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },

  // Page 36 (Oktober 2025)
  { page: 36, rawNo: '1', name: 'Tamborin Musik Rebana Tambourine', date: 'Oktober 2025', qty: 5, unit: 'Pcs', source: 'Dana BOSP', location: 'Ruang OSIS', spec: 'Tambourine Perkusi Musik', cond: 'B' },
  { page: 36, rawNo: '2', name: 'Perangkat Jaringan & Aksesori Komputer (Kabel XLR 15m, Kabel Audio 60m, Hardisk Seagate 2TB, Tang RJ45, Detektor RJ45, Mouse Wireless NYK)', date: 'Oktober 2025', qty: 6, unit: 'Item/Paket', source: 'Dana BOSP', location: 'Ruang OSIS', spec: 'Hardisk Eksternal 2TB & Alat Jaringan', cond: 'B' },
  { page: 36, rawNo: '3', name: 'Keyboard Komputer + Mouse USB', date: 'Oktober 2025', qty: 5, unit: 'Set', source: 'Dana BOSP', location: 'Lab Komputer', spec: 'Standard USB Keyboard & Optical Mouse', cond: 'B' },

  // Page 37
  { page: 37, rawNo: '4', name: 'Speaker Aktif Portable Audio', date: 'Oktober 2025', qty: 1, unit: 'Pcs', source: 'Dana BOSP', location: 'Ruang OSIS', cond: 'B' },
  { page: 37, rawNo: '5', name: 'Amplifier TOA ZA-2120', date: 'Oktober 2025', qty: 1, unit: 'Pcs', source: 'Dana BOSP', location: 'Kantor', brand: 'TOA', spec: 'Model ZA-2120 Mixer Power Amplifier', cond: 'B' },
  { page: 37, rawNo: '6', name: 'TOA Horn Speaker Lapangan', date: 'Oktober 2025', qty: 1, unit: 'Pcs', source: 'Dana BOSP', location: 'Lapangan', brand: 'TOA', spec: 'Corong TOA Outdoor Speaker', cond: 'B' },

  // Page 38 (November 2025)
  { page: 38, rawNo: '7', name: 'Printer Epson Multifungsi Kantor', date: 'Oktober 2025', qty: 1, unit: 'Pcs', source: 'Dana BOSP', location: 'Kantor', brand: 'Epson', cond: 'B' },
  { page: 38, rawNo: '8', name: 'Seragam Baju Pramuka Siswa', date: 'November 2025', qty: 30, unit: 'Pcs', source: 'Dana BOSP', location: 'Ruang OSIS', material: 'Kain Katun Pramuka', cond: 'B' },
  { page: 38, rawNo: '9', name: 'Taplak Meja Lagu & Tamborin', date: 'November 2025', qty: 20, unit: 'Pcs', source: 'Dana BOSP', location: 'Ruang OSIS', cond: 'B' },

  // Page 39
  { page: 39, rawNo: '3', name: 'Baju Seragam Paskibra Lengkap', date: 'November 2025', qty: 20, unit: 'Pasang', source: 'Dana BOSP', location: 'Ruang OSIS', material: 'Kain Drill Putih', cond: 'B' },
  { page: 39, rawNo: '4', name: 'Baki Upacara Kayu/Logam', date: 'November 2025', qty: 1, unit: 'Pcs', source: 'Dana BOSP', location: 'Ruang OSIS', material: 'Kayu Pelitur Coklat', cond: 'B' },
  { page: 39, rawNo: '5', name: 'Sepatu Pantofel Paskibra', date: 'November 2025', qty: 10, unit: 'Pasang', source: 'Dana BOSP', location: 'Ruang OSIS', material: 'Kulit Sintetis Hitam/Putih', cond: 'B' },

  // Page 40 (Desember 2025 - CATATAN AUDIT: BARANG RUSAK/MUSNAH)
  { page: 40, rawNo: '1', name: 'Bola Olahraga Rusak (Bola Volly 13, Net Volly 1, Bola Basket 1, Bola Futsal 10)', date: 'Desember 2025', qty: 25, unit: 'Pcs', source: 'Dana BOSP', location: 'Rusak / Musnah', cond: 'RB', condNote: 'Kondisi Rusak Berat / Telah Musnah karena pemakaian', notes: 'Usulan penghapusan aset rusak' },
  { page: 40, rawNo: '2', name: 'Kursi & Meja Kelas Siswa', date: 'Desember 2025', qty: 30, unit: 'Set', source: 'Dana BOSP', location: 'Ruang Kelas', material: 'Rangka Besi & Kayu', cond: 'B' },
  { page: 40, rawNo: '3', name: 'Lemari Besi / Arsip Sekolah (Rusak)', date: 'Desember 2025', qty: 3, unit: 'Pcs', source: 'Dana BOS', location: 'Rusak / Musnah', material: 'Plat Besi', cond: 'RB', condNote: 'Kondisi Rusak Berat / Tidak Layak Pakai', notes: 'Usulan penghapusan dari daftar inventaris aktif' },

  // Page 41 (Maret 2026)
  { page: 41, rawNo: '1', name: 'Alat Kebersihan Gedung (Serapan 25, Ember Pel 30, Gayung 20, Kemoceng 205)', date: 'Maret 2026', qty: 280, unit: 'Pcs', source: 'BOSP', location: 'Gudang Sapras', cond: 'B' },
  { page: 41, rawNo: '2', name: 'Alat Kebersihan Lantai (Sapu 50, Kain Pel 50)', date: 'Maret 2026', qty: 100, unit: 'Pcs', source: 'BOSP', location: 'Gudang Sapras', cond: 'B' },
  { page: 41, rawNo: '3', name: 'Alat Olahraga Sekolah (Bola Volly 15, Bola Futsal 10, Net Voli 2, Cone Mangkok 5, Stopwatch 1, Jaring Gawang 2, Cone Kerucut 5, Net Tenis Meja 3, Bola Tenis Meja 5, Bola Basket 10)', date: 'Maret 2026', qty: 58, unit: 'Pcs/Unit', source: 'BOSP', location: 'Gudang Sapras', cond: 'B' },

  // Page 42 (Mei 2026)
  { page: 42, rawNo: '4', name: 'Buku Paket "Pendidikan Pancasila"', date: 'Mei 2026', qty: 160, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Kurikulum Merdeka', cond: 'B' },
  { page: 42, rawNo: '5', name: 'Buku Paket "Pathway to English" Tingkat Lanjut', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 42, rawNo: '6', name: 'Buku Paket "Matematika"', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 42, rawNo: '7', name: 'Buku Paket "Bahasa Indonesia"', date: 'Mei 2026', qty: 160, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },

  // Page 43
  { page: 43, rawNo: '8', name: 'Buku Paket "Sejarah"', date: 'Mei 2026', qty: 160, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 43, rawNo: '9', name: 'Buku Paket "Ekonomi"', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 43, rawNo: '10', name: 'Buku Paket "Sejarah Pilihan" Tingkat Lanjut', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 43, rawNo: '11', name: 'Buku Paket "Biologi"', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },

  // Page 44
  { page: 44, rawNo: '12', name: 'Buku Paket "Kimia"', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 44, rawNo: '13', name: 'Buku Paket "Fisika"', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 44, rawNo: '14', name: 'Buku Paket "Geografi"', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 44, rawNo: '15', name: 'Buku Paket "Informatika"', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },

  // Page 45
  { page: 45, rawNo: '13b', name: 'Buku Paket "Pathway to English" Tingkat Lanjut (Edisi Lanjutan)', date: 'Mei 2026', qty: 160, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 45, rawNo: '14b', name: 'Buku Paket "Sosiologi"', date: 'Mei 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan', spec: 'Penerbit Erlangga', cond: 'B' },
  { page: 45, rawNo: '15b', name: 'Tali Kur (20) & Tongkat Pramuka (1)', date: 'Mei 2026', qty: 21, unit: 'Pcs', source: 'BOSP', location: 'Ruang OSIS', cond: 'B' },
  { page: 45, rawNo: '16', name: 'Emblem Pramuka (20) & Topi', date: 'Mei 2026', qty: 20, unit: 'Pcs', source: 'BOSP', location: 'Ruang OSIS', cond: 'B' },

  // Page 46
  { page: 46, rawNo: '17', name: 'Epolet Pundak Paskibra', date: 'Mei 2026', qty: 20, unit: 'Pasang', source: 'BOSP', location: 'Ruang OSIS', cond: 'B' },
  { page: 46, rawNo: '18', name: 'Topi Paskibra Siswa', date: 'Mei 2026', qty: 20, unit: 'Pcs', source: 'BOSP', location: 'Ruang OSIS', cond: 'B' },
  { page: 46, rawNo: '19', name: 'Tanda Jasa / Medali Upacara', date: 'Mei 2026', qty: 20, unit: 'Pcs', source: 'BOSP', location: 'Ruang OSIS', cond: 'B' },
  { page: 46, rawNo: '20', name: 'Kopel Sabuk Putih Paskibra', date: 'Mei 2026', qty: 20, unit: 'Pcs', source: 'BOSP', location: 'Ruang OSIS', cond: 'B' },
  { page: 46, rawNo: '21', name: 'Sepatu Pantofel Paskibra', date: 'Mei 2026', qty: 20, unit: 'Pasang', source: 'BOSP', location: 'Ruang OSIS', cond: 'B' },

  // Page 47
  { page: 47, rawNo: '22', name: 'Printer Epson EcoTank L3211', date: 'Mei 2026', qty: 1, unit: 'Unit', source: 'Dana Kegiatan', location: 'Kantor Guru', brand: 'Epson', spec: 'L3211 Color All-in-One InkTank', cond: 'B' },
  { page: 47, rawNo: '23', name: 'Kursi & Meja Kelas (Status: Dimusnahkan)', date: 'Mei 2026', qty: 21, unit: 'Unit', source: 'BOSP', location: 'Dimusnahkan', cond: 'RB', condNote: 'Kondisi Rusak Berat - Telah dimusnahkan secara administratif', notes: 'Surat Keputusan Pemusnahan Aset Rusak' },
  { page: 47, rawNo: '24a', name: 'Proyektor Epson EB-W51', date: 'Mei 2026', qty: 2, unit: 'Unit', source: 'BOSP', location: 'Aula', brand: 'Epson', spec: 'EB-W51 4000 Lumens WXGA 3LCD Projector', cond: 'B' },
  { page: 47, rawNo: '24b', name: 'Etalase Literasi Baca SMAS TBJS', date: 'Mei 2026', qty: 1, unit: 'Unit', source: 'BOSP', location: 'Lapangan Sekolah', spec: 'Etalase Kaca Rangka Aluminium Sudut Baca', cond: 'B' },

  // Page 48 (Juli - Juni 2026)
  { page: 48, rawNo: '1', name: 'Kanopi Tempat Teduh Lapangan SMAS Tunas Baru (30 m2)', date: 'Juli 2026', qty: 30, unit: 'm2', source: 'BOSP', location: 'Lapangan SMAS Tunas Baru', spec: 'Rangka Baja Ringan / Atap Spandek Peneduh 30m2', cond: 'B' },
  { page: 48, rawNo: '2', name: 'Pompa Air Listrik Otomatis', date: 'Juli 2026', qty: 1, unit: 'Unit', source: 'BOSP', location: 'Belakang Toilet', brand: 'Shimizu', cond: 'B' },
  { page: 48, rawNo: '3', name: 'Lemari Kaca Arsip Kantor', date: 'Juli 2026', qty: 1, unit: 'Unit', source: 'BOSP', location: 'Kantor Kepala Sekolah', material: 'Kaca Geser & Rangka Besi', cond: 'B' },
  { page: 48, rawNo: '4', name: 'Meja Kantor Guru Ergonomis', date: 'Juni 2026', qty: 22, unit: 'Unit', source: 'Yayasan', location: 'Kantor Guru', material: 'Kayu Partikel Melamin Putih/Grey', cond: 'B' },

  // Page 49
  { page: 49, rawNo: '1', name: 'Kursi Kantor Guru Ergonomis Jaring Hitam', date: 'Juni 2026', qty: 22, unit: 'Unit', source: 'Yayasan', location: 'Kantor Guru', material: 'Mesh Jaring & Kaki Roda Hidrolik', cond: 'B' },
  { page: 49, rawNo: '2', name: 'Kursi Desk Perpustakaan Bantalan Hitam', date: 'Juni 2026', qty: 10, unit: 'Unit', source: 'Yayasan', location: 'Perpustakaan', material: 'Rangka Besi Pipa Hitam', cond: 'B' },
  { page: 49, rawNo: '3', name: 'Meja Baca Perpustakaan Luas', date: 'Juni 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Perpustakaan', material: 'Kayu Lapis HPL Putih', cond: 'B' },
  { page: 49, rawNo: '4', name: 'Speaker Bass Merk Fender Rumble', date: 'Juni 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Aula', brand: 'Fender', spec: 'Bass Guitar Amplifier Combo', cond: 'B' },
  { page: 49, rawNo: '5', name: 'Speaker Aktif Yamaha DBR Series', date: 'Juni 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Aula', brand: 'Yamaha', spec: 'DBR12 / DBR15 Powered Speaker', cond: 'B' },

  // Page 50
  { page: 50, rawNo: '1', name: 'Stand Mic Hercules Tinggi', date: 'Juni 2026', qty: 4, unit: 'Unit', source: 'Yayasan', location: 'Aula', brand: 'Hercules', spec: 'Boom Microphone Stand Tripod', cond: 'B' },
  { page: 50, rawNo: '2', name: 'Kabel Jack Gitar 10 Meter', date: 'Juni 2026', qty: 6, unit: 'Unit', source: 'Yayasan', location: 'Aula', spec: 'Kabel Audio Jack 6.5mm Panjang 10m', cond: 'B' },
  { page: 50, rawNo: '3', name: 'Microfon Telinga Headset Wireless Merk Hardwell', date: 'Juni 2026', qty: 1, unit: 'Set', source: 'Yayasan', location: 'Aula', brand: 'Hardwell', spec: 'Wireless Headworn Mic Pack', cond: 'B' },
  { page: 50, rawNo: '4', name: 'Gitar Bass Listrik 4-String', date: 'Juni 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Aula', spec: 'Electric Bass Solid Body Black', cond: 'B' },
  { page: 50, rawNo: '5', name: 'Microphone Hardwell Wireless Handheld Pair XY', date: 'Juni 2026', qty: 2, unit: 'Unit', source: 'Yayasan', location: 'Aula', brand: 'Hardwell', spec: 'Dual Wireless Handheld Microphone', cond: 'B' },

  // Page 51
  { page: 51, rawNo: '1', name: 'Stand Book Notasi Musik Merk Hercules', date: 'Juni 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Aula', brand: 'Hercules', spec: 'Orchestra Sheet Music Stand Besi Lubang', cond: 'B' },
  { page: 51, rawNo: '2', name: 'Stand Gitar dan Bass Floor', date: 'Juni 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Aula', spec: 'Multi Guitar Stand Dudukan Besi', cond: 'B' },
  { page: 51, rawNo: '3', name: 'Speaker Aktif Gitar Listrik Merk Peavey Celestion GT12', date: 'Juni 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Aula', brand: 'Peavey', spec: 'Peavey Celestion Speaker Enclosure GT12', cond: 'B' },
  { page: 51, rawNo: '4', name: 'Gitar Listrik Stratocaster Putih/Hitam', date: 'Juni 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Aula', spec: 'Electric Guitar Solid Body 6-String', cond: 'B' },
  { page: 51, rawNo: '5', name: 'AC (Air Conditioner) Split Wall Perpustakaan', date: 'Juni 2026', qty: 2, unit: 'Unit', source: 'Yayasan', location: 'Perpustakaan', spec: 'AC Split Pendingin Ruang Perpus', cond: 'B' },

  // Page 52
  { page: 52, rawNo: '1', name: 'Rak Buku Besi 3 Tingkat Perpustakaan', date: 'Juli 2026', qty: 6, unit: 'Unit', source: 'Yayasan', location: 'Perpustakaan', material: 'Besi Hollow Cat Hitam', cond: 'B' },
  { page: 52, rawNo: '2', name: 'Rak Buku Besi 5 Tingkat Perpustakaan', date: 'Juli 2026', qty: 9, unit: 'Unit', source: 'Yayasan', location: 'Perpustakaan', material: 'Besi Hollow Cat Hitam 5 Susun', cond: 'B' },
  { page: 52, rawNo: '3', name: 'Buku Paket "Matematika" Kelas XII SMA', date: 'Juli 2026', qty: 80, unit: 'Eks', source: 'BOSP', location: 'Perpustakaan / pada Siswa', spec: 'Penerbit Erlangga / Kemdikbud', cond: 'B' },

  // Page 53
  { page: 53, rawNo: '1', name: 'AC (Air Conditioner) Cassette / Split Kantor Lt 2', date: 'September 2026', qty: 1, unit: 'Unit', source: 'Yayasan', location: 'Kantor Lt. 2', spec: 'AC Pendingin Ruang Kantor Guru Lantai 2', cond: 'B' },
];

function parseYearFromDate(dateStr: string): number | null {
  const match = dateStr.match(/\b(202[0-9])\b/);
  return match ? parseInt(match[1], 10) : null;
}

function parseMonthFromDate(dateStr: string): string | null {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  for (const m of months) {
    if (new RegExp(m, 'i').test(dateStr)) return m;
  }
  return null;
}

export function buildOfficialInventoryDataset(): InventoryItem[] {
  let counter = 1;
  return rawDataset.map((entry) => {
    const classification = classifyInventoryItem(
      entry.name,
      `${entry.spec || ''} ${entry.brand || ''} ${entry.material || ''}`,
      entry.location,
      entry.date,
      entry.qty,
      entry.unit
    );

    const year = parseYearFromDate(entry.date);
    const month = parseMonthFromDate(entry.date);
    const regNumber = String(counter).padStart(4, '0');
    counter++;

    const item: InventoryItem = {
      id: `ITEM-${entry.page}-${entry.rawNo}-${counter}`,
      pageNumber: entry.page,
      sourceDocument: OFFICIAL_DOCUMENT_NAME,
      rawItemNo: entry.rawNo,
      rawName: entry.name,
      standardName: entry.name,
      category: classification.category,
      categoryLabel: classification.categoryLabel,
      confidence: classification.confidence,
      classificationReason: classification.reason,
      purchaseDateRaw: entry.date,
      purchaseYear: year,
      purchaseMonth: month,
      quantity: entry.qty,
      unit: entry.unit,
      fundingSource: entry.source,
      location: entry.location,
      photoRef: `Halaman ${entry.page} Foto Terlampir`,
      condition: entry.cond || classification.suggestedFields.condition || 'B',
      conditionNote: entry.condNote || (entry.cond === 'RB' ? 'Rusak Berat / Dimusnahkan' : 'Kondisi Baik'),
      brandModel: entry.brand || classification.suggestedFields.brandModel || '-',
      sizeSpec: entry.spec || classification.suggestedFields.sizeSpec || '-',
      material: entry.material || classification.suggestedFields.material || '-',
      engineNumber: '-',
      chassisNumber: '-',
      policeNumber: '-',
      bpkbNumber: '-',
      bookTitle: classification.suggestedFields.bookTitle || (entry.name.includes('Buku') ? entry.name : undefined),
      bookPublisher: classification.suggestedFields.bookPublisher || (entry.name.includes('Erlangga') ? 'Penerbit Erlangga' : undefined),
      areaM2: entry.unit === 'm2' ? entry.qty : null,
      unitPrice: null, // PRINSIP AUDIT: Jangan mengarang harga jika kosong di sumber asli
      totalPrice: null,
      itemCode: '-', // Kode barang tidak dicantumkan di buku manual
      registerNumber: regNumber,
      remarks: entry.notes || `Data asli dari Buku Inventaris SMAS Tunas Baru Jin Seung Hal. ${entry.page}`,
      verificationStatus: entry.cond === 'RB' ? 'PERLU_VERIFIKASI' : 'TERKONFIRMASI',
      missingFields: ['Harga Perolehan', 'Kode Barang Resmi'],
      auditTrail: [
        {
          id: `LOG-EXT-${counter}`,
          timestamp: '2026-11-10T20:00:00Z',
          action: 'EXTRACTED',
          reason: `Ekstraksi faktual dari PDF "${OFFICIAL_DOCUMENT_NAME}" Halaman ${entry.page}`,
          actor: 'SYSTEM_OCR',
        },
        {
          id: `LOG-CLS-${counter}`,
          timestamp: '2026-11-10T20:00:01Z',
          action: 'CLASSIFIED',
          newValue: classification.category,
          reason: classification.reason,
          actor: 'SYSTEM_CLASSIFIER',
        },
      ],
    };

    return item;
  });
}
