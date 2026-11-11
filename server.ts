import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static assets from public
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'SMART KIB - Inventory Data Processor',
    geminiConfigured: !!aiClient,
  });
});

// Proxy route for AI-assisted parsing & contextual classification (protects API key server-side)
app.post('/api/ai/classify', async (req, res) => {
  try {
    const { itemName, rawText, location, purchaseDate, unit, quantity } = req.body;
    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Falling back to deterministic rule engine.',
      });
    }

    const prompt = `Anda adalah auditor aset pemerintah dan ahli pengelolaan Kartu Inventaris Barang (KIB) sesuai Permendagri No. 19/2016 dan Permendagri No. 108/2016.
Klasifikasikan barang berikut secara faktual dan ketat:
Nama Barang: "${itemName}"
Keterangan/Raw Text: "${rawText || '-'}"
Lokasi: "${location || '-'}"
Tanggal/Tahun: "${purchaseDate || '-'}"
Jumlah: "${quantity} ${unit || ''}"

Pilih salah satu klasifikasi KIB resmi:
- KIB A: Tanah
- KIB B: Peralatan dan Mesin (Kendaraan, elektronik, komputer, printer, AC, sound system, meja/kursi kantor/kelas, dispenser, pompa air, dll)
- KIB C: Gedung dan Bangunan (Gedung, ruang kelas, kanopi permanen yang sudah selesai)
- KIB D: Jalan, Irigasi, dan Jaringan (Jaringan pipa air PDAM, instalasi kabel wifi, jalan, jembatan)
- KIB E: Aset Tetap Lainnya (Buku perpustakaan/paket, karya seni/alat musik seperti gitar/drum/tamborin, alat peraga globe/peta/komparator, hewan/tanaman)
- KIB F: Konstruksi Dalam Pengerjaan (Proyek konstruksi yang belum selesai)
- NON_KAPITALISASI: Belanja barang yang tidak dikapitalisasi / habis pakai / alat kebersihan (sapu, ember, kemoceng, baygon, sabun, baterai, bohlam lampu kecil, perlengkapan pramuka sekali pakai) jika nilai < Rp 300.000 atau bukan aset tetap.

Format respon JSON:
{
  "category": "KIB_A" | "KIB_B" | "KIB_C" | "KIB_D" | "KIB_E" | "KIB_F" | "NON_KAPITALISASI",
  "categoryLabel": "KIB B - Peralatan dan Mesin",
  "confidence": 0.95,
  "reason": "Alasan hukum/administrasi singkat dan faktual",
  "recommendedFields": {
    "merk": "string atau null",
    "spesifikasi": "string atau null",
    "kondisi": "Baik" | "Kurang Baik" | "Rusak Berat"
  }
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    const parsed = JSON.parse(text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in AI classification:', error);
    res.status(500).json({ error: error?.message || 'AI Classification failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SMART KIB server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
