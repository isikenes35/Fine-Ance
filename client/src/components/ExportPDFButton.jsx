import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function ExportPDFButton({ periodLabel }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    const element = document.getElementById('sankey-chart-container');
    if (!element) {
      toast.error('Dışa aktarılacak diyagram bulunamadı.');
      return;
    }

    try {
      setExporting(true);
      toast.loading('PDF oluşturuluyor...', { id: 'pdf-export' });

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#0B1120',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Header
      pdf.setFillColor(11, 17, 32);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(241, 245, 249);
      pdf.text('Fine-ance — Sankey Diyagramı', 15, 15);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184);
      pdf.text(periodLabel || '', 15, 22);

      // Image
      const imgProps = pdf.getImageProperties(imgData);
      const maxWidth = pageWidth - 30;
      const maxHeight = pageHeight - 35;
      let imgWidth = maxWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = (imgProps.width * imgHeight) / imgProps.height;
      }

      const x = (pageWidth - imgWidth) / 2;
      pdf.addImage(imgData, 'PNG', x, 28, imgWidth, imgHeight);

      const fileName = `Fine-ance_Sankey_${periodLabel?.replace(/\s+/g, '_') || 'export'}.pdf`;
      pdf.save(fileName);

      toast.success('PDF başarıyla indirildi!', { id: 'pdf-export' });
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('PDF oluşturulurken hata oluştu.', { id: 'pdf-export' });
    } finally {
      setExporting(false);
    }
  }, [periodLabel]);

  return (
    <button
      className="btn btn-primary"
      onClick={handleExport}
      disabled={exporting}
      id="export-pdf-btn"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {exporting ? 'İndiriliyor...' : 'PDF İndir'}
    </button>
  );
}
