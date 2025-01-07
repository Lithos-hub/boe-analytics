<template>
  <div class="Home__wrapper">
    <section class="grid grid-cols-12 gap-5">
      <article class="col-span-9">
        <Card>
          <h5>Lo más reciente - {{ boeDate }}</h5>

          <hr class="my-5 border border-primary/10" />

          <div class="flex flex-col gap-5">
            <strong>Principales puntos:</strong>

            <ul>
              <li>
                Punto 1. Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Quis a doloribus corporis dolore eligendi.
              </li>
              <li>
                Punto 2. Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Quis a doloribus corporis dolore eligendi.
              </li>
              <li>
                Punto 3. Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Quis a doloribus corporis dolore eligendi.
              </li>
            </ul>
          </div>
        </Card>
      </article>
      <article class="col-span-3">
        <Card> Graphic card </Card>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const boeDate = "lunes 6 de enero de 2025";
</script>

<style scoped lang="scss">
@use "@/assets/scss/main.scss" as *;

.Home {
  &__wrapper {
    @apply flex items-center justify-center h-screen;
  }
}
</style>
