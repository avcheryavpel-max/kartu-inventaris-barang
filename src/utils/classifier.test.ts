import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyInventoryItem } from './classifier';
import { runComprehensiveValidation } from './validator';
import { buildOfficialInventoryDataset } from '../data/defaultInventory';

test('KIB B: Laptop ASUS VivoBook classifies to Peralatan dan Mesin', () => {
  const result = classifyInventoryItem('Laptop ASUS VivoBook', 'Core i3 14 inch', 'Kantor Kepala Sekolah', '7 Februari 2024', 1, 'Unit');
  assert.equal(result.category, 'KIB_B');
  assert.equal(result.suggestedFields.brandModel, 'ASUS');
  assert.ok(result.reason.includes('Peralatan'));
});

test('KIB E: Buku Paket Pendidikan Pancasila classifies to Aset Tetap Lainnya', () => {
  const result = classifyInventoryItem('Buku Paket "Pendidikan Pancasila" Terbitan Erlangga', '', 'Perpustakaan', '18 April 2024', 144, 'Eks');
  assert.equal(result.category, 'KIB_E');
  assert.ok(result.suggestedFields.bookPublisher?.includes('Erlangga'));
  assert.ok(result.reason.includes('Buku'));
});

test('NON_KAPITALISASI: Sapu lidi and cleaning supplies classify to Non-Kapitalisasi', () => {
  const result = classifyInventoryItem('Sapu Lidi Kebersihan', '', 'Gudang Kebersihan', '24 April 2024', 20, 'Batang');
  assert.equal(result.category, 'NON_KAPITALISASI');
  assert.ok(result.reason.includes('Non-Kapitalisasi'));
});

test('KIB D: Meteran PDAM and pipe network classifies to Jaringan', () => {
  const result = classifyInventoryItem('Pemasangan Jaringan & Meteran PDAM', 'Pipa air dan sambungan', 'Parkiran Siswa', '30 Maret 2024', 1, 'Unit');
  assert.equal(result.category, 'KIB_D');
  assert.ok(result.reason.includes('Jaringan'));
});

test('KIB C: Kanopi Halaman Sekolah classifies to Gedung dan Bangunan', () => {
  const result = classifyInventoryItem('Kanopi Tempat Teduh Lapangan SMAS Tunas Baru (30 m2)', 'Baja Ringan Spandek', 'Lapangan SMAS', 'Juli 2026', 30, 'm2');
  assert.equal(result.category, 'KIB_C');
  assert.equal(result.suggestedFields.areaM2, 30);
});

test('Kondisi Rusak: detects RB condition for items in Rusak/Musnah', () => {
  const result = classifyInventoryItem('Lemari Besi (Rusak / Musnah)', '', 'Rusak / Musnah', 'Desember 2025', 3, 'Pcs');
  assert.equal(result.suggestedFields.condition, 'RB');
});

test('Validator: runs 12-point audit validation on default dataset', () => {
  const items = buildOfficialInventoryDataset();
  assert.ok(items.length > 50, 'Default dataset must contain over 50 items from the 53-page PDF');

  const summary = runComprehensiveValidation(items, 53, items.length);
  assert.ok(summary.readinessScore > 50, 'Readiness score should be calculated');
  assert.equal(summary.totalItems, items.length);
  assert.ok(summary.kibCounts.KIB_B > 0, 'KIB B items exist');
  assert.ok(summary.kibCounts.KIB_E > 0, 'KIB E items exist');
  assert.ok(summary.kibCounts.NON_KAPITALISASI > 0, 'Non-Kapitalisasi items exist');

  // Verify Zero Data Loss check passes
  const zeroLossIssues = summary.issues.filter(i => i.ruleId === 1);
  assert.equal(zeroLossIssues.length, 0, 'Zero-loss check must pass when extracted count matches declared count');
});
