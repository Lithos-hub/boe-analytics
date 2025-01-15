import { jsPDF } from 'jspdf';
import type { PDFData } from './pdf.interfaces';
export const generatePDF = (data: PDFData[], title: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Styles settings
  const styles = {
    title: { fontSize: 16, fontStyle: 'bold' },
    subtitle: { fontSize: 14, fontStyle: 'bold' },
    text: { fontSize: 12, fontStyle: 'normal' },
    listItem: { fontSize: 12, fontStyle: 'normal' },
  };

  // Helper function to add text with automatic line break
  const addWrappedText = (text: string, y: number, style: any) => {
    doc.setFontSize(style.fontSize);
    if (style.fontStyle === 'bold') doc.setFont('helvetica', 'bold');
    else doc.setFont('helvetica', 'normal');

    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    return y + lines.length * style.fontSize * 0.3;
  };

  //   Section titles
  data.forEach((textSection) => {
    yPosition = addWrappedText(textSection.heading, yPosition, styles.title);
    yPosition += 10;
  });

  // Section text
  data.forEach((textSection) => {
    const items = textSection.text
      .replace(/<[^>]*>/g, '')
      .split('\n')
      .filter((item) => item.trim());

    items.forEach((item) => {
      yPosition = addWrappedText(
        `• ${item.trim()}`,
        yPosition,
        styles.listItem,
      );
      yPosition += 5;
    });
  });

  doc.save(`${title}.pdf`);
};
