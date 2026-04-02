<script setup>
const { data: products } = await useFetch('/api/products')
</script>

<template>
  <div class="flex flex-col items-center py-12 px-6">
    <div class="max-w-6xl w-full flex justify-between items-end mb-12 px-4">
      <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">Start Your 3 Day Free Trial</h1>
      <div class="flex items-center space-x-1 text-xs font-bold">
        <span class="text-green-500 mr-2 flex items-center">Save up to 20% <span class="ml-1">↩</span></span>
        <div class="bg-gray-200 p-1 rounded-lg flex space-x-1">
          <button class="bg-white px-3 py-1 rounded shadow-sm text-gray-800 border-none">Annual</button>
          <button class="px-3 py-1 text-gray-500 border-none">Monthly</button>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-6 max-w-6xl w-full justify-center px-4">
      <div v-for="product in products?.slice(0, 3)" :key="product.id"
           class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">

        <div class="h-1.5 w-full bg-gradient-to-r from-green-400 to-cyan-400"></div>

        <div class="pt-8 px-7 pb-8">
          <h2 class="text-2xl font-bold text-gray-800 tracking-tight">{{ product.name }} - Annual</h2>

          <div class="inline-block bg-gray-50 text-gray-400 text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded border border-gray-100 mt-4">
            3-days free then:
          </div>

          <div class="mt-4 flex items-baseline text-gray-800">
            <span class="text-2xl font-bold align-top mt-1">$</span>
            <span class="text-5xl font-extrabold tracking-tight">{{ product.price }}</span>
            <span class="text-gray-400 ml-1 font-medium text-lg">/month</span>
          </div>

          <p class="text-[12px] text-gray-400 mt-1">
            billed yearly at <span class="line-through">$1,188</span> <span class="font-bold text-gray-500">{{ product.oldPrice }}</span>
          </p>

          <div class="mt-4">
            <span class="bg-green-50 text-green-600 text-[11px] font-bold px-3 py-1.5 rounded-md border border-green-100">
              $189 in savings
            </span>
          </div>

          <button class="w-full mt-8 py-4 px-4 rounded-xl font-black transition-all duration-200
                         bg-[#FFB800] hover:bg-[#F2AE00] text-gray-800 shadow-[0_4px_0_0_#D99C00] active:shadow-none active:translate-y-[2px] uppercase text-sm">
            Try It Free
          </button>

          <hr class="mt-8 mb-8 border-gray-100">

          <ul class="space-y-4">
            <li class="flex items-start">
              <img src="https://api.iconify.design/solar:star-fall-minimalistic-bold.svg?color=%23bef264" class="w-5 h-5 mr-3 shrink-0">
              <div class="text-[14px]">
                <p class="text-gray-600 font-bold leading-tight">{{ product.usersText }}</p>
                <p class="text-[11px] text-gray-400 mt-0.5">(extra team members for $35/month)</p>
              </div>
            </li>
            <li class="flex items-center text-[14px]">
              <img src="https://api.iconify.design/solar:star-fall-minimalistic-bold.svg?color=%23bef264" class="w-5 h-5 mr-3 shrink-0">
              <span class="text-gray-600 font-bold">Save unlimited properties</span>
            </li>
            <li class="flex items-center text-[14px]">
              <img src="https://api.iconify.design/solar:star-fall-minimalistic-bold.svg?color=%23bef264" class="w-5 h-5 mr-3 shrink-0">
              <span class="text-gray-600 font-bold">{{ product.exports }} exports</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
