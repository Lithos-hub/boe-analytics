<template>
  <div class="About">
    <img
      src="/logo-big.png"
      class="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 object-cover opacity-10" />
    <section class="flex flex-col items-center justify-center gap-5">
      <h3 class="w-1/2 text-center text-2xl">
        Conocer y entender las leyes y medidas que se aplican a diario en el
        Boletín Oficial del Estado no es solo un derecho que tenemos como
        ciudadanos, sino también una obligación.
      </h3>
      <h3 class="w-1/2 text-center text-2xl">
        Muchos de estos documentos son extremadamente largos y complejos, lo que
        dificulta su lectura y comprensión. Es ahí donde entra en juego
      </h3>
      <h3
        class="from-primary bg-gradient-to-br to-green-500 bg-clip-text text-[80px] font-bold text-transparent">
        Boe Analytics
      </h3>
    </section>
    <section class="About__section-explanation">
      <h3 class="About__title">¿Qué es BOE Analytics?</h3>
      <div class="About__description">
        <p>
          BOE Analytics es un proyecto
          <strong>de código abierto</strong>
          y
          <strong>sin ánimo de lucro</strong>
          que permite a los usuarios
          <strong>analizar</strong>
          y
          <strong>visualizar</strong>
          los datos de los
          <strong>Boletines Oficiales del Estado</strong>
          de España. La aplicación se basa en la extracción de datos de los
          documentos web de los boletines oficiales y su posterior procesamiento
          con
          <strong>LLM</strong>
          (Large Language Models) para su análisis y visualización.
        </p>
        <br />
        <p>
          El modelo encargado de realizar esta tarea pertenece a
          <strong>DeepSeek</strong>
          , un potente proyecto de Inteligencia Artificial de código abierto.
        </p>
      </div>
    </section>
    <section class="About__section-explanation">
      <h3 class="About__title">¿Qué hace?</h3>
      <div class="About__description">
        <p>
          En la vista principal se visualiza el análisis del BOE dividido en
          varias secciones:
        </p>

        <ul class="About__list">
          <li class="About__list-item">
            <strong>Resumen:</strong>
            Resumen de unos pocos párrafos del BOE.
          </li>
          <li class="About__list-item">
            <strong>Puntos claves del boletín:</strong>
            Lista de los puntos más relevantes del documento.
          </li>
          <li class="About__list-item">
            <strong>Palabras clave:</strong>
            Lista de las palabras clave del documento.
          </li>
          <li class="About__list-item">
            <strong>Estadísticas:</strong>
            Aspectos positivos, negativos y neutros del documento en formato
            gráfico.
          </li>
          <li class="About__list-item">
            <strong>Áreas:</strong>
            Sectores de la sociedad (Sanidad, Economía, Educación, Justicia,
            etc) a los que afecta el documento y una descripción breve del cómo
            afecta cada uno.
          </li>
          <li class="About__list-item">
            <strong>Aspectos positivos, negativos y neutros:</strong>
            Detalle más extenso de los aspectos positivos, negativos y neutrales
            del documento junto a una descripción breve de cada uno.
          </li>
        </ul>
      </div>
    </section>
    <section class="About__section-explanation">
      <h3 class="About__title">¿Cómo funciona?</h3>
      <div class="About__description">
        <p>
          Simplemente selecciona una fecha en el
          <strong>calendario</strong>
          o escríbela en la URL para generar el análisis del BOE de ese día.
        </p>
        <p>
          Ten en cuenta que algunos documentos son considerablemente grandes en
          cuanto a cantidad de palabras e información a procesar, por lo que el
          tiempo de análisis puede variar.
        </p>
        <div
          class="flex flex-wrap items-center gap-2 rounded-2xl border border-blue-500/50 bg-blue-500/10 p-5">
          <UIcon
            name="i-heroicons-information-circle"
            class="h-6 w-6 text-blue-500" />
          <p>
            Cada BOE analizado es guardado en la base de datos
            <strong>sin necesidad de registrar una cuenta.</strong>
          </p>
          <ul class="About__list">
            <li class="About__list-item">
              Los BOEs analizados y almacenados aparecerán con un
              <span class="font-bold text-green-500">punto verde</span>
              en el
              <strong class="text-primary-500">calendario.</strong>
            </li>
            <li>
              Los BOEs cuyo análisis no ha sido posible por algún motivo
              aparecerán con un
              <span class="font-bold text-red-500">punto rojo</span>
              y serán guardados igualmente en la base de datos.
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'about',
});
</script>

<style lang="scss" scoped>
.About {
  @apply relative h-[calc(100vh-150px)] snap-y snap-proximity;
  p {
    @apply text-center text-lg text-primary-200 md:text-left;

    strong {
      @apply text-primary-500;
    }
  }

  &__title {
    @apply col-span-12 text-center text-2xl font-bold text-white md:col-span-1 md:text-[50px] md:leading-[100px];
  }

  &__description {
    @apply col-span-12 flex flex-col gap-5 text-lg text-primary-200 md:col-span-1;
  }

  &__list {
    @apply flex list-disc flex-col gap-2 p-5;

    strong {
      @apply text-primary-500;
    }
  }

  section {
    @apply h-[calc(100vh-150px)] snap-center;
  }

  &__section-explanation {
    @apply grid grid-cols-2 items-center justify-center;
  }
}
</style>
