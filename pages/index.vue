<script setup lang="ts">
import BoeManager from '~/components/Boe/Manager.vue';
</script>

<template>
  <div class="Home__wrapper">
    <BoeManager />
    <section class="flex w-full flex-wrap justify-center gap-5">
      <article class="grow">
        <Card>
          <Calendar />
        </Card>
      </article>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/text.scss' as *;

.Home {
  &__wrapper {
    @apply flex flex-col items-center justify-center gap-5;
  }
}
</style>
