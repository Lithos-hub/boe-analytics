<template>
  <div class="Home__wrapper">
    <section class="grid grid-cols-12 gap-5">
      <article class="col-span-9">
        <Card>
          <h5>BOE de hoy - {{ todayDate }}</h5>

          <strong>Principales puntos:</strong>

          <ul>
            <li>
              Punto 1. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quis a doloribus corporis dolore eligendi.
            </li>
            <li>
              Punto 2. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quis a doloribus corporis dolore eligendi.
            </li>
            <li>
              Punto 3. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quis a doloribus corporis dolore eligendi.
            </li>
          </ul>
        </Card>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
const todayDate = new Date().toLocaleDateString();
</script>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";

.Home {
  &__wrapper {
    @apply flex items-center justify-center h-screen;
  }
}
</style>
