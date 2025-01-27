<template>
  <div class="flex">
    <nav class="flex w-[300px] min-w-[300px] flex-col gap-2.5 py-2.5 pl-2.5">
      <div class="rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <Calendar />
      </div>
      <div class="rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <div class="flex flex-col justify-center gap-2.5">
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
            color="green"
            variant="soft"
            class="border border-green-500/50"
            icon="i-heroicons-arrow-down-tray"
            @click="downloadPDF">
            Descargar PDF
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
        </div>
      </div>
    </nav>
    <div class="flex-1 p-2.5">
      <div
        class="max-h-[calc(100vh-95px)] overflow-y-scroll rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <slot />
      </div>
    </div>
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
  const margin = 50;
  let yPosition = height - margin;

  const drawTextBlock = (
    title,
    content,
    fontSizeTitle,
    fontSizeContent,
    spacing,
  ) => {
    page.drawText(title, {
      x: margin,
      y: yPosition,
      size: fontSizeTitle,
      font: helveticaFont,
      color: rgb(99, 102, 241),
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

  drawTextBlock('Resumen', summary.value, 18, 12, 40);
  drawTextBlock(
    'Puntos principales',
    mainPoints.value.join('\n\n'),
    18,
    12,
    40,
  );
  drawTextBlock('Palabras clave', keywords.value.join(', '), 18, 12, 40);

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
