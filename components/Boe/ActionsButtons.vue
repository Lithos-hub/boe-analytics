<template>
  <div class="flex flex-row justify-center gap-2.5 md:flex-col">
    <UButton
      color="secondary"
      variant="soft"
      class="border border-secondary-500/50"
      icon="i-heroicons-arrow-top-right-on-square"
      target="_blank"
      :disabled="!selectedDocumentToAnalyze"
      :to="selectedDocumentToAnalyze?.url">
      Ver BOE
    </UButton>
    <UButton
      color="dark"
      variant="soft"
      class="border border-dark-500/50"
      :disabled="!selectedDocumentToAnalyze"
      :icon="
        isShowingJSON
          ? 'i-heroicons-document-chart-bar'
          : 'i-heroicons-code-bracket'
      "
      @click="toggleJSON">
      {{ isShowingJSON ? 'Ver análisis' : 'Ver JSON' }}
    </UButton>
    <UButton
      color="green"
      variant="soft"
      class="border border-green-500/50"
      icon="i-heroicons-arrow-down-tray"
      :disabled="!selectedDocumentToAnalyze"
      @click="downloadPDF">
      Descargar PDF
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf';

const {
  isShowingJSON,
  selectedDocumentToAnalyze,
  summary,
  mainPoints,
  keywords,
  areas,
  aspects,
} = storeToRefs(useBoeStore());

const toggleJSON = () => {
  isShowingJSON.value = !isShowingJSON.value;
};

const downloadPDF = async () => {
  const doc = new jsPDF();

  // Doc title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);

  const title = `${selectedDocumentToAnalyze.value?.id} - Análisis`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textWidth = doc.getTextWidth(title);
  const xPosition = (pageWidth - textWidth) / 2;
  const yPosition = pageHeight / 2;
  doc.text(title, xPosition, yPosition);

  // summary
  doc.setFont('helvetica', 'normal');
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Resumen', 20, 20);

  const data = {
    summary: summary.value.replaceAll('<br>', '\n'),
    mainPoints: mainPoints.value,
    keywords: keywords.value,
    areas: areas.value,
    aspects: aspects.value,
  };

  doc.setFontSize(12);
  doc.text(data.summary, 20, 30, { maxWidth: 170 });

  // Main points
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Puntos principales', 20, 20);

  doc.setFontSize(12);
  data.mainPoints.forEach((point, index) => {
    doc.text(`${index + 1}. ${point}`, 20, 30 + index * 10, { maxWidth: 170 });
  });

  // Keywords
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Palabras Clave', 20, 20);

  doc.setFontSize(12);
  doc.text(data.keywords.join(', '), 20, 30, { maxWidth: 170 });

  // Areas
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Áreas Afectadas', 20, 20);

  doc.setFontSize(12);
  data.areas.forEach((area, index) => {
    doc.text(`${area.name}: ${area.description}`, 20, 30 + index * 20, {
      maxWidth: 170,
    });
  });

  // Aspects
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Aspectos a destacar', 20, 20);

  doc.setFontSize(12);
  data.aspects.forEach((aspect, index) => {
    doc.text(`${aspect.aspect}: ${aspect.description}`, 20, 30 + index * 20, {
      maxWidth: 170,
    });
  });

  // Save PDF
  doc.save(`${selectedDocumentToAnalyze.value?.id}.pdf`);
};
</script>
