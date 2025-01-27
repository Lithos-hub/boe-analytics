<template>
  <div class="flex flex-row justify-center gap-2.5 md:flex-col">
    <UButton
      color="secondary"
      variant="soft"
      class="border border-secondary-500/50"
      icon="i-heroicons-arrow-top-right-on-square"
      target="_blank"
      :to="boeUrl">
      Ver BOE
    </UButton>
    <UButton
      color="dark"
      variant="soft"
      class="border border-dark-500/50"
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
      disabled
      @click="downloadPDF">
      Descargar PDF (Soon)
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const { isShowingJSON, boeUrl, summary, mainPoints, keywords, areas, aspects } =
  storeToRefs(useBoeStore());

const toggleJSON = () => {
  isShowingJSON.value = !isShowingJSON.value;
};

const downloadPDF = async () => {
  const pdfDoc = await PDFDocument.create();

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([600, 800]);

  const { width, height } = page.getSize();
  const margin = 20;
  let yPosition = height - margin;

  const drawTextBlock = (
    title: string,
    content: string,
    fontSizeTitle: number,
    fontSizeContent: number,
    spacing: number,
  ) => {
    page.drawText(title, {
      x: margin,
      y: yPosition,
      size: fontSizeTitle,
      font: helveticaFont,
      color: rgb(0.2, 0.2, 0.5),
    });
    yPosition -= spacing;

    page.drawText(content, {
      x: margin,
      y: yPosition,
      size: fontSizeContent,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= spacing + content.split('\n').length * fontSizeContent;
  };

  drawTextBlock('Resumen', summary.value, 16, 12, 40);
  drawTextBlock('Puntos principales', mainPoints.value.join('\n'), 16, 12, 40);
  drawTextBlock('Palabras clave', keywords.value.join('\n'), 16, 12, 40);

  page.drawText('Áreas', {
    x: margin,
    y: yPosition,
    size: 18,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 40;

  areas.value.forEach(({ name, description }, index) => {
    page.drawText(`${index + 1}. ${name}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    page.drawText(description, {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 40;
  });

  page.drawText('Aspectos', {
    x: margin,
    y: yPosition,
    size: 18,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 40;

  aspects.value.forEach(({ aspect, type, description }, index) => {
    page.drawText(`${index + 1}. ${aspect} (${type})`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    page.drawText(description, {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 40;
  });
  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);

  link.download = `${boeUrl.value.split('id=')[1]}.pdf`;

  link.click();
};
</script>

<style scoped></style>
