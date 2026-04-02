<script setup>
useHead({
  script: [
    { src: 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js' }
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: { lang: 'uk' }
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="mr-6 flex items-center">
          <span class="font-black text-xl tracking-tighter text-emerald-600">MY<span>SHOP</span></span>
        </NuxtLink>

        <nav class="flex gap-6 font-bold text-xs uppercase tracking-widest">
          <NuxtLink
            to="/"
            class="text-gray-500 hover:text-gray-900 transition-colors py-4"
            active-class="text-emerald-600 border-b-2 border-emerald-500"
          >
            Картки товарів
          </NuxtLink>
          <NuxtLink
            to="/table"
            class="text-gray-500 hover:text-gray-900 transition-colors py-4"
            active-class="text-blue-600 border-b-2 border-blue-500"
          >
            Таблиця (Завдання 2)
          </NuxtLink>
        </nav>
      </template>

      <template #right>
        <div class="flex items-center gap-2">
          <UColorModeButton />
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-xs text-gray-400 font-medium">Built with Nuxt UI • © {{ new Date().getFullYear() }}</p>
      </template>
    </UFooter>
  </UApp>
</template>

<style>
nav a {
  border-bottom: 2px solid transparent;
}
</style>
