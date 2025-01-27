<template>
  <div class="md:flex md:flex-row">
    <nav
      class="mx-2.5 hidden flex-col gap-2.5 py-2.5 md:m-0 md:flex md:w-[300px] md:min-w-[300px] md:pl-2.5">
      <div class="rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <Calendar />
      </div>
      <div class="rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <BoeActionsButtons />
      </div>
    </nav>
    <div class="m-2.5 md:m-0 md:flex-1 md:p-2.5">
      <div
        class="max-h-[calc(100vh-100px)] overflow-y-scroll rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
        <slot />
      </div>
    </div>
  </div>
</template>
