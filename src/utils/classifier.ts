import { KIBCategory, ConditionType, InventoryItem } from '../types/inventory';

export interface ClassificationResult {
  category: KIBCategory;
  categoryLabel: string;
  confidence: number;
  reason: string;
  suggestedFields: {
    standardName?: string;
    brandModel?: string;
    sizeSpec?: string;
    material?: string;
    condition?: ConditionType;
    bookTitle?: string;
    bookPublisher?: string;
    areaM2?: number | null;
    constructionType?: string;
    isConcrete?: boolean | null;
  };
}

export function classifyInventoryItem(
  name: string,
  rawText: string = '',
  location: string = '',
  purchaseDate: string = '',
  quantity: number = 1,
  unit: string = ''
): ClassificationResult {
  const combined = `${name} ${rawText} ${location}`.toLowerCase();

  // 1. NON-KAPITALISASI / BARANG HABIS PAKAI (< Rp. 300.000)
  // Sapu, pel, kemoceng, ember, sabun, pewangi, baygon, sunlight, kabel kecil, lakban, steker, bola lampu, seragam/aksesori murah, shuttlecock
  const isCleaningConsumable =
    combined.includes('sapu lidi') ||
    combined.includes('sapu lantai') ||
    combined.includes('kain pel') ||
    combined.includes('ember pel') ||
    combined.includes('pengki') ||
    combined.includes('kemoceng') ||
    combined.includes('alat kebersihan') ||
    combined.includes('sunlight') ||
    combined.includes('so klin') ||
    combined.includes('baygon') ||
    combined.includes('vixal') ||
    combined.includes('sabun cuci') ||
    combined.includes('hit nyamuk') ||
    combined.includes('gayung') ||
    combined.includes('serapan');

  const isConsumableMaterial =
    combined.includes('cat semprot') ||
    combined.includes('lem pipa') ||
    combined.includes('semen') ||
    combined.includes('batu bata') ||
    combined.includes('pahat batu') ||
    combined.includes('bola lampu') ||
    combined.includes('lampu led') ||
    combined.includes('brilmax') ||
    combined.includes('ecolink') ||
    combined.includes('pikolite') ||
    combined.includes('steker') ||
    combined.includes('lakban') ||
    combined.includes('selang air') ||
    combined.includes('taplak meja') ||
    combined.includes('tali tambang') ||
    combined.includes('tali kur') ||
    combined.includes('emblem') ||
    combined.includes('topi') ||
    combined.includes('epolet') ||
    combined.includes('tanda jasa') ||
    combined.includes('kopel') ||
    combined.includes('baki') ||
    combined.includes('box file') ||
    combined.includes('kok bulu') ||
    combined.includes('shuttlecock') ||
    combined.includes('skipping') ||
    combined.includes('hula hup') ||
    combined.includes('kerucut plastik') ||
    combined.includes('cone');

  if (isCleaningConsumable) {
    return {
      category: 'NON_KAPITALISASI',
      categoryLabel: 'Belanja Non-Kapitalisasi (< Rp. 300.000)',
      confidence: 0.98,
      reason:
        'Barang operasional kebersihan dan pemeliharaan habis pakai (consumables) dengan nilai ekonomis di bawah batas kapitalisasi aset tetap (< Rp 300.000). Sesuai juknis inventarisasi, dicatat pada Daftar Non-Kapitalisasi.',
      suggestedFields: {
        condition: 'B',
      },
    };
  }

  if (isConsumableMaterial && !combined.includes('tenda')) {
    return {
      category: 'NON_KAPITALISASI',
      categoryLabel: 'Belanja Non-Kapitalisasi (< Rp. 300.000)',
      confidence: 0.92,
      reason:
        'Bahan penunjang operasional/habis pakai bernilai kecil (< Rp 300.000) yang tidak memenuhi kriteria pengakuan Aset Tetap Permendagri No. 19/2016.',
      suggestedFields: {
        condition: 'B',
      },
    };
  }

  // 2. KIB E - ASET TETAP LAINNYA
  // Buku Paket, Buku Perpustakaan, Alat Musik, Alat Peraga Seni/Budaya, Peta, Globe, Hewan/Tumbuhan
  const isBook =
    combined.includes('buku paket') ||
    combined.includes('buku perpustakaan') ||
    combined.includes('terbitan erlangga') ||
    combined.includes('pendidikan pancasila') ||
    combined.includes('kompeten berbahasa') ||
    combined.includes('pathway to english') ||
    combined.includes('ips ekonomi') ||
    combined.includes('ips geografi') ||
    combined.includes('ips sosiologi') ||
    combined.includes('ipa biologi') ||
    combined.includes('ipa fisika') ||
    combined.includes('ipa kimia') ||
    combined.includes('mtk tl') ||
    combined.includes('matematika') ||
    combined.includes('sejarah') ||
    combined.includes('atlas');

  const isArtMusicalInstrument =
    combined.includes('gitar') ||
    combined.includes('drum set') ||
    combined.includes('tamborin') ||
    combined.includes('bass listrik');

  const isEducationalModel =
    combined.includes('globe') ||
    combined.includes('peta indonesia') ||
    combined.includes('peta dunia') ||
    combined.includes('komparator') ||
    combined.includes('gambar presiden');

  if (isBook) {
    let title = name.replace(/buku\s*paket/gi, '').replace(/terbitan\s*erlangga/gi, '').trim();
    if (title.startsWith('"') && title.endsWith('"')) {
      title = title.substring(1, title.length - 1);
    }
    return {
      category: 'KIB_E',
      categoryLabel: 'KIB E – Aset Tetap Lainnya',
      confidence: 0.99,
      reason:
        'Buku perpustakaan dan buku teks mata pelajaran sekolah merupakan koleksi kepustakaan yang dicatat dalam KIB E (Aset Tetap Lainnya - Buku/Perpustakaan).',
      suggestedFields: {
        bookTitle: title || name,
        bookPublisher: combined.includes('erlangga') ? 'Penerbit Erlangga' : 'Kemendikbudristek',
        condition: 'B',
      },
    };
  }

  if (isArtMusicalInstrument) {
    let brand = '';
    if (combined.includes('yamaha')) brand = 'Yamaha';
    else if (combined.includes('tornado')) brand = 'Tornado';
    else if (combined.includes('j. guitar') || combined.includes('j guitar')) brand = 'J. Guitar';

    return {
      category: 'KIB_E',
      categoryLabel: 'KIB E – Aset Tetap Lainnya',
      confidence: 0.95,
      reason:
        'Instrumen alat musik dan perlengkapan kesenian merupakan barang bercorak kesenian/kebudayaan yang diklasifikasikan ke dalam KIB E (Aset Tetap Lainnya).',
      suggestedFields: {
        brandModel: brand,
        condition: 'B',
      },
    };
  }

  if (isEducationalModel) {
    return {
      category: 'KIB_E',
      categoryLabel: 'KIB E – Aset Tetap Lainnya',
      confidence: 0.94,
      reason:
        'Alat peraga pendidikan (Peta, Globe, Komparator, Foto Kenegaraan Resmi) berstatus aset tetap bercorak kebudayaan/alat peraga KIB E.',
      suggestedFields: {
        condition: 'B',
      },
    };
  }

  // 3. KIB F - KONSTRUKSI DALAM PENGERJAAN (KDP)
  // Proyek pengadaan, konstruksi belum rampung
  if (combined.includes('proyek pengadaan') || combined.includes('kdp') || combined.includes('dalam pengerjaan')) {
    return {
      category: 'KIB_F',
      categoryLabel: 'KIB F – Konstruksi Dalam Pengerjaan',
      confidence: 0.92,
      reason:
        'Pekerjaan fisik konstruksi yang dicatat dalam dokumen sebagai "Proyek Pengadaan" dan memenuhi kriteria KDP sebelum serah terima aset final.',
      suggestedFields: {
        condition: 'B',
        constructionType: 'Besi / Baja Ringan',
      },
    };
  }

  // 4. KIB D - JALAN, IRIGASI, DAN JARINGAN
  // Pemasangan meteran PDAM, instalasi pipa air, instalasi jaringan wifi/listrik utama
  if (
    combined.includes('meteran pdam') ||
    combined.includes('jaringan pipa') ||
    combined.includes('instalasi pipa') ||
    combined.includes('saluran irigasi') ||
    combined.includes('biaya pemasangan wifi') ||
    combined.includes('jaringan listrik')
  ) {
    return {
      category: 'KIB_D',
      categoryLabel: 'KIB D – Jalan, Irigasi, dan Jaringan',
      confidence: 0.93,
      reason:
        'Infrastruktur jaringan air minum/perpipaan (PDAM) atau jaringan transmisi komunikasi/listrik diklasifikasikan ke dalam KIB D (Jaringan).',
      suggestedFields: {
        condition: 'B',
      },
    };
  }

  // 5. KIB C - GEDUNG DAN BANGUNAN
  // Gedung, kanopi permanen yang sudah selesai, pintu permanen aluminium composite, mimbar/panggung lapangan permanen
  if (
    combined.includes('kanopi') ||
    combined.includes('pintu toilet') ||
    combined.includes('mimbar/panggung') ||
    combined.includes('gedung') ||
    combined.includes('ruang kelas')
  ) {
    let areaM2: number | null = null;
    if (combined.includes('30 m2') || combined.includes('30m2')) areaM2 = 30;

    return {
      category: 'KIB_C',
      categoryLabel: 'KIB C – Bangunan dan Gedung',
      confidence: 0.91,
      reason:
        'Konstruksi fisik bangunan, fasilitas naungan (kanopi permanen), dan prasarana arsitektur pelengkap gedung sekolah masuk dalam KIB C.',
      suggestedFields: {
        areaM2,
        isConcrete: false,
        condition: 'B',
      },
    };
  }

  // 6. KIB A - TANAH
  if (combined.includes('tanah') || combined.includes('lahan') || combined.includes('persil')) {
    return {
      category: 'KIB_A',
      categoryLabel: 'KIB A – Tanah',
      confidence: 0.99,
      reason: 'Aset berwujud berupa hamparan tanah/lahan milik yayasan/sekolah masuk dalam KIB A.',
      suggestedFields: {
        condition: 'B',
      },
    };
  }

  // 7. KIB B - PERALATAN DAN MESIN (Default untuk aset perkantoran, TIK, lab, mebel, kendaraan, pompa, sound)
  // Laptop, PC, Printer, AC, Mesin Absensi, Kipas Plafon, Dispenser, Kamera, Kasur Medis, Meja, Kursi, Speaker, Pompa Air, Proyektor, UPS, dll.
  let brand = '';
  if (combined.includes('asus')) brand = 'ASUS';
  else if (combined.includes('canon')) brand = 'Canon';
  else if (combined.includes('epson')) brand = 'Epson';
  else if (combined.includes('hp')) brand = 'HP';
  else if (combined.includes('panasonic')) brand = 'Panasonic';
  else if (combined.includes('kdk')) brand = 'KDK';
  else if (combined.includes('cosmos')) brand = 'Cosmos';
  else if (combined.includes('shimizu')) brand = 'Shimizu';
  else if (combined.includes('hardwell')) brand = 'Hardwell';
  else if (combined.includes('ashley')) brand = 'Ashley';
  else if (combined.includes('fender')) brand = 'Fender';
  else if (combined.includes('peavey')) brand = 'Peavey';
  else if (combined.includes('yamaha')) brand = 'Yamaha';
  else if (combined.includes('toa')) brand = 'TOA';
  else if (combined.includes('ica')) brand = 'ICA';
  else if (combined.includes('century')) brand = 'Century';
  else if (combined.includes('hercules')) brand = 'Hercules';

  // Deteksi kondisi khusus: Rusak / Musnah / Dimusnahkan
  let cond: ConditionType = 'B';
  if (combined.includes('rusak') || combined.includes('musnah') || combined.includes('dimusnahkan')) {
    cond = 'RB';
  }

  return {
    category: 'KIB_B',
    categoryLabel: 'KIB B – Peralatan dan Mesin',
    confidence: 0.94,
    reason:
      'Peralatan kerja kantor, mesin pendingin/elektronik, teknologi informasi/komputer, furnitur mebeler, dan alat peraga laboratorium yang memiliki nilai manfaat jangka panjang (> 12 bulan) diklasifikasikan ke KIB B.',
    suggestedFields: {
      brandModel: brand || undefined,
      condition: cond,
    },
  };
}

export const KIB_CATEGORY_META: Record<
  KIBCategory,
  { label: string; short: string; color: string; badgeBg: string; border: string; desc: string }
> = {
  KIB_A: {
    label: 'KIB A – Tanah',
    short: 'KIB A',
    color: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    border: 'border-emerald-500',
    desc: 'Seluruh aset tanah, lahan kaveling, dan persil milik institusi.',
  },
  KIB_B: {
    label: 'KIB B – Peralatan dan Mesin',
    short: 'KIB B',
    color: 'text-blue-700',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-300',
    border: 'border-blue-500',
    desc: 'Komputer, laptop, printer, mebel, AC, audio, pompa, kasur medis, dan peralatan kantor.',
  },
  KIB_C: {
    label: 'KIB C – Gedung dan Bangunan',
    short: 'KIB C',
    color: 'text-amber-700',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
    border: 'border-amber-500',
    desc: 'Gedung sekolah, ruang kelas, kanopi permanen peneduh, dan struktur arsitektural.',
  },
  KIB_D: {
    label: 'KIB D – Jalan, Irigasi, dan Jaringan',
    short: 'KIB D',
    color: 'text-indigo-700',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    border: 'border-indigo-500',
    desc: 'Jaringan instalasi air PDAM, transmisi listrik, instalasi kabel wifi, jalan, drainase.',
  },
  KIB_E: {
    label: 'KIB E – Aset Tetap Lainnya',
    short: 'KIB E',
    color: 'text-purple-700',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-300',
    border: 'border-purple-500',
    desc: 'Buku teks perpustakaan/paket, alat musik, barang seni, globe, peta, dan koleksi.',
  },
  KIB_F: {
    label: 'KIB F – Konstruksi Dalam Pengerjaan',
    short: 'KIB F',
    color: 'text-rose-700',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-300',
    border: 'border-rose-500',
    desc: 'Pekerjaan proyek konstruksi bangunan/prasarana yang belum selesai (KDP).',
  },
  NON_KAPITALISASI: {
    label: 'Belanja Non-Kapitalisasi (< Rp 300.000)',
    short: 'Non-Kapitalisasi',
    color: 'text-slate-700',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    border: 'border-slate-400',
    desc: 'Alat kebersihan, perlengkapan habis pakai, dan barang berbiaya rendah di bawah threshold kapitalisasi.',
  },
};
