import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if available or fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

export interface PDFInspectionResult {
  fileName: string;
  fileSize: number;
  pageCount: number;
  hasTextLayer: boolean;
  isScannedPdf: boolean;
  pagePreviews: string[]; // data URLs of rendered canvases
  extractedPagesText: { page: number; text: string }[];
}

export async function inspectAndParsePDF(
  file: File,
  maxPreviewPages = 6
): Promise<PDFInspectionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pageCount = pdf.numPages;
  const pagePreviews: string[] = [];
  const extractedPagesText: { page: number; text: string }[] = [];
  let totalTextChars = 0;

  const pagesToRender = Math.min(pageCount, maxPreviewPages);

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str || '')
      .join(' ')
      .trim();

    totalTextChars += pageText.length;
    extractedPagesText.push({ page: pageNum, text: pageText });

    // Render thumbnail for initial preview pages
    if (pageNum <= pagesToRender) {
      try {
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport } as any).promise;
          pagePreviews.push(canvas.toDataURL('image/jpeg', 0.8));
        }
      } catch (renderErr) {
        console.warn(`Could not render preview for page ${pageNum}:`, renderErr);
      }
    }
  }

  const avgCharsPerPage = totalTextChars / (pageCount || 1);
  const isScannedPdf = avgCharsPerPage < 30; // Scanned PDF has very little or no native text layer

  return {
    fileName: file.name,
    fileSize: file.size,
    pageCount,
    hasTextLayer: !isScannedPdf,
    isScannedPdf,
    pagePreviews,
    extractedPagesText,
  };
}
