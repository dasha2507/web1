<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

useHead({
  title: 'Список продуктів',
  link: [
    { rel: 'stylesheet', href: 'https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css' }
  ]
})

const router = useRouter()
const subscriptionStore = useSubscriptionStore()

const billingCycle = ref('annual')

const { data: products } = await useFetch('/api/products')

const filteredProducts = computed(() => {
  if (!products.value) return []
  return products.value.filter(item => item.cycle === billingCycle.value)
})

const choosePlanAndCheckout = (plan) => {
  subscriptionStore.setPlan(plan)
  router.push('/checkout')
}
</script>

<template>
  <div class="bg-gray-50 flex flex-col items-center min-h-screen p-4 font-sans text-slate-800">

    <div class="w-full max-w-6xl flex flex-wrap items-center justify-between mb-12 mt-12 px-6">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">Start Your 3 Day Free Trial</h1>

      <div class="flex items-center gap-4 mt-6 sm:mt-0">
        <div class="flex items-center gap-1">
          <span class="text-[11px] text-green-600 font-bold italic whitespace-nowrap">Save up to 20%</span>
          <img src="https://api.iconify.design/lucide:undo-2.svg?color=%2316a34a"
               class="w-4 h-4 rotate-[150deg] scale-y-[-1]" alt="arrow pointer">
        </div>

        <div class="relative bg-gray-200 p-1 rounded-lg flex shadow-inner w-[180px] h-[38px]">
          <div
            class="absolute top-1 bottom-1 transition-all duration-300 bg-white shadow-sm rounded-md"
            :style="{
              left: billingCycle === 'annual' ? '4px' : '90px',
              width: '86px'
            }"
          ></div>
          <button @click="billingCycle = 'annual'" class="relative z-10 flex-1 text-[12px] font-bold cursor-pointer transition-colors" :class="billingCycle === 'annual' ? 'text-slate-800' : 'text-gray-500'">Annual</button>
          <button @click="billingCycle = 'monthly'" class="relative z-10 flex-1 text-[12px] font-bold cursor-pointer transition-colors" :class="billingCycle === 'monthly' ? 'text-slate-800' : 'text-gray-500'">Monthly</button>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-8 max-w-[1250px] w-full items-stretch pb-20 px-4">
      <div v-for="item in filteredProducts" :key="item.title"
           class="bg-white w-full sm:w-[380px] rounded-2xl transition-all duration-300 border border-gray-100 shadow-lg hover:shadow-2xl flex flex-col overflow-hidden">

        <div class="h-1.5 w-full bg-gradient-to-r from-green-400 to-cyan-500"></div>

        <div class="p-8 flex flex-col h-full">
          <h2 class="text-2xl font-bold text-slate-800">{{ item.title }}</h2>

          <div class="mt-2 mb-4">
            <span class="inline-block bg-gray-100 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              3-days free then:
            </span>
          </div>

          <div class="mt-2 flex items-baseline">
            <span class="text-2xl font-bold text-slate-800 mr-0.5">$</span>
            <span class="text-5xl font-black text-slate-800 tracking-tighter">{{ item.price }}</span>
            <span class="text-gray-400 ml-1 font-bold text-lg">/month</span>
          </div>

          <div v-if="item.fullPrice" class="mt-2">
            <p class="text-[12px] text-gray-400">
              billed yearly at <span class="line-through text-gray-300">${{ item.fullPrice }}</span>
              <span class="font-bold text-gray-500 ml-1">${{ item.oldPrice }}</span>
            </p>
          </div>

          <div v-if="item.savings" class="self-start bg-green-50 text-green-600 text-[11px] font-black px-3 py-1 rounded-md border border-green-100 mt-4 mb-4">
            ${{ item.savings }} in savings
          </div>

          <div v-if="!item.fullPrice" class="h-8"></div>

          <div class="flex justify-center mb-8 mt-4 w-full block">
            <button @click="choosePlanAndCheckout(item)" class="w-full py-4 px-4 bg-[#FFB800] hover:bg-[#FFC122] text-slate-900 text-[15px] font-black rounded-xl shadow-[0_4px_0_0_#D99C00] active:shadow-none active:translate-y-[4px] transition-all tracking-wide uppercase cursor-pointer border-none">
              {{ item.buttonText }}
            </button>
          </div>

          <div class="h-px w-full bg-gray-100 mb-8"></div>

          <ul class="space-y-5 flex-grow">
            <li v-for="feature in item.features" :key="feature.main" class="flex items-start">
              <img src="https://api.iconify.design/iconoir:spark-solid.svg?color=%23bef264"
                   class="w-5 h-5 mt-0.5 mr-3 shrink-0" alt="sparkle">
              <div>
                <p class="text-[14px] text-slate-700 font-bold leading-tight">{{ feature.main }}</p>
                <p v-if="feature.sub" class="text-[11px] text-gray-400 mt-1 leading-tight">{{ feature.sub }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
