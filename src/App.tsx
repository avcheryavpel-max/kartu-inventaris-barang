import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { UploadStep } from './components/UploadStep';
import { ExtractionStep } from './components/ExtractionStep';
import { ClassificationStep } from './components/ClassificationStep';
import { TemplateMappingStep } from './components/TemplateMappingStep';
import { ValidationStep } from './components/ValidationStep';
import { ReviewTableStep } from './components/ReviewTableStep';
import { ExportStep } from './components/ExportStep';
import { AuditTrailModal } from './components/AuditTrailModal';
import { EditItemModal } from './components/EditItemModal';
import { PDFViewerModal } from './components/PDFViewerModal';
import { InstitutionSettingsModal } from './components/InstitutionSettingsModal';

import { InventoryItem, KIBCategory } from './types/inventory';
import {
  buildOfficialInventoryDataset,
  OFFICIAL_DOCUMENT_NAME,
  OFFICIAL_TEMPLATE_NAME,
  TOTAL_OFFICIAL_PAGES,
} from './data/defaultInventory';
import { DEFAULT_INSTITUTION, InstitutionInfo } from './utils/excelExporter';
import { runComprehensiveValidation } from './utils/validator';
import { inspectAndParsePDF } from './utils/pdfParser';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(7); // Allow free exploration of all stages

  const [items, setItems] = useState<InventoryItem[]>(() => buildOfficialInventoryDataset());
  const [institution, setInstitution] = useState<InstitutionInfo>(DEFAULT_INSTITUTION);

  const [inventoryFileName, setInventoryFileName] = useState<string>(OFFICIAL_DOCUMENT_NAME);
  const [templateFileName, setTemplateFileName] = useState<string>(OFFICIAL_TEMPLATE_NAME);
  const [totalPages, setTotalPages] = useState<number>(TOTAL_OFFICIAL_PAGES);
  const [isUsingSample, setIsUsingSample] = useState<boolean>(true);

  // Modals
  const [auditItem, setAuditItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewingPdfPage, setViewingPdfPage] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Recalculate validation summary on items change
  const validationSummary = useMemo(() => {
    return runComprehensiveValidation(items, totalPages, items.length);
  }, [items, totalPages]);

  const handleStepProceed = (nextStep: number) => {
    setCurrentStep(nextStep);
    if (nextStep > maxReachedStep) {
      setMaxReachedStep(nextStep);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadOfficialSample = () => {
    setItems(buildOfficialInventoryDataset());
    setInventoryFileName(OFFICIAL_DOCUMENT_NAME);
    setTemplateFileName(OFFICIAL_TEMPLATE_NAME);
    setTotalPages(TOTAL_OFFICIAL_PAGES);
    setIsUsingSample(true);
  };

  const handleCustomInventoryUpload = async (file: File) => {
    setInventoryFileName(file.name);
    setIsUsingSample(false);
    try {
      const inspection = await inspectAndParsePDF(file);
      setTotalPages(inspection.pageCount);
    } catch (err) {
      console.warn('PDF inspection fallback:', err);
    }
  };

  const handleCustomTemplateUpload = (file: File) => {
    setTemplateFileName(file.name);
  };

  const handleUpdateCategory = (itemId: string, newCategory: KIBCategory, reason: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const oldCat = item.category;
          return {
            ...item,
            category: newCategory,
            isUserModifiedCategory: true,
            auditTrail: [
              ...item.auditTrail,
              {
                id: `LOG-RECLASS-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: 'RECLASSIFIED',
                fieldModified: 'category',
                oldValue: oldCat,
                newValue: newCategory,
                reason,
                actor: 'USER_AUDITOR',
              },
            ],
          };
        }
        return item;
      })
    );
  };

  const handleSaveEditedItem = (updatedItem: InventoryItem, changeReason: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === updatedItem.id) {
          return {
            ...updatedItem,
            auditTrail: [
              ...i.auditTrail,
              {
                id: `LOG-EDIT-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: 'EDITED',
                reason: changeReason,
                actor: 'USER_AUDITOR',
              },
            ],
          };
        }
        return i;
      })
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleBulkVerify = (itemIds: string[]) => {
    setItems((prev) =>
      prev.map((i) => {
        if (itemIds.includes(i.id)) {
          return {
            ...i,
            verificationStatus: 'TERKONFIRMASI',
            auditTrail: [
              ...i.auditTrail,
              {
                id: `LOG-VERIF-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: 'CONFIRMED',
                reason: 'Dikonfirmasi secara massal oleh pemeriksa aset',
                actor: 'USER_AUDITOR',
              },
            ],
          };
        }
        return i;
      })
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset seluruh data ke kondisi awal dokumen resmi SMAS Tunas Baru?')) {
      handleLoadOfficialSample();
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-200 selection:text-slate-900">
      {/* Top Header */}
      <Header
        institution={institution}
        activeDocumentName={inventoryFileName}
        totalPages={totalPages}
        totalItems={items.length}
        readinessScore={validationSummary.readinessScore}
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Stepper Navigation */}
      <Stepper
        currentStep={currentStep}
        onSelectStep={(step) => handleStepProceed(step)}
        maxReachedStep={maxReachedStep}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <UploadStep
            inventoryFileName={inventoryFileName}
            templateFileName={templateFileName}
            totalPages={totalPages}
            isUsingSample={isUsingSample}
            onLoadOfficialSample={handleLoadOfficialSample}
            onCustomInventoryUpload={handleCustomInventoryUpload}
            onCustomTemplateUpload={handleCustomTemplateUpload}
            onProceed={() => handleStepProceed(2)}
          />
        )}

        {currentStep === 2 && (
          <ExtractionStep
            items={items}
            totalPages={totalPages}
            onProceed={() => handleStepProceed(3)}
            onViewPdfPage={(p) => setViewingPdfPage(p)}
          />
        )}

        {currentStep === 3 && (
          <ClassificationStep
            items={items}
            onUpdateCategory={handleUpdateCategory}
            onProceed={() => handleStepProceed(4)}
            onViewItemDetail={(item) => setAuditItem(item)}
          />
        )}

        {currentStep === 4 && (
          <TemplateMappingStep onProceed={() => handleStepProceed(5)} />
        )}

        {currentStep === 5 && (
          <ValidationStep
            summary={validationSummary}
            onProceed={() => handleStepProceed(6)}
          />
        )}

        {currentStep === 6 && (
          <ReviewTableStep
            items={items}
            onEditItem={(item) => setEditingItem(item)}
            onDeleteItem={handleDeleteItem}
            onViewAuditTrail={(item) => setAuditItem(item)}
            onViewPdfPage={(p) => setViewingPdfPage(p)}
            onBulkVerify={handleBulkVerify}
            onProceed={() => handleStepProceed(7)}
          />
        )}

        {currentStep === 7 && (
          <ExportStep
            items={items}
            summary={validationSummary}
            institution={institution}
            onUpdateInstitution={setInstitution}
          />
        )}
      </main>

      {/* Modals */}
      <AuditTrailModal
        item={auditItem}
        onClose={() => setAuditItem(null)}
        onOpenPdfPage={(p) => setViewingPdfPage(p)}
      />

      <EditItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEditedItem}
      />

      <PDFViewerModal
        pageNumber={viewingPdfPage}
        allItems={items}
        totalPages={totalPages}
        onClose={() => setViewingPdfPage(null)}
        onNavigatePage={(p) => setViewingPdfPage(p)}
      />

      <InstitutionSettingsModal
        isOpen={isSettingsOpen}
        institution={institution}
        onClose={() => setIsSettingsOpen(false)}
        onSave={setInstitution}
      />
    </div>
  );
}
