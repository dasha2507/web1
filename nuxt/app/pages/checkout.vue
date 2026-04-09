<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: products } = await useFetch('/api/products')

const selectedPlan = computed(() => {
  if (!products.value) return null
  return products.value.find(p => p.title === route.query.title) || products.value[1]
})
const totalDue = computed(() => {
  if (!selectedPlan.value) return '$0.00'
  return selectedPlan.value.cycle === 'annual'
    ? `$${selectedPlan.value.oldPrice}.00`
    : `$${selectedPlan.value.price}`
})

const form = ref({
  cardNumber: '', expiry: '', cvc: '', fullName: 'dev4 dev4', address: '', consent: false
})

const submitForm = async () => {
  try {
    const response = await $fetch('/api/subscription/create', {
      method: 'POST',
      body: form.value
    })
    alert('Success: ' + response.message)
  } catch (error) {
    alert('Помилка: ' + error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-12 font-sans text-slate-800">
    <div class="bg-[#333333] text-white text-center py-4 text-lg font-bold mb-8">
      Checkout
    </div>

    <div class="max-w-[1000px] mx-auto px-4">
      <NuxtLink to="/" class="text-gray-500 text-sm hover:underline mb-6 inline-block">&lt;&lt; back</NuxtLink>

      <h1 class="text-[22px] font-bold text-gray-800 mb-2">You're Almost In - Start Your 3-Day Free Trial Now!</h1>
      <p class="text-gray-600 mb-8 text-[15px]">Set up your account to gain instant access! You won't be charged if you decide to cancel within 3 days</p>

      <div class="flex flex-col md:flex-row gap-8 items-start" v-if="selectedPlan">

        <div class="bg-white w-full md:w-[350px] rounded-2xl border border-gray-100 shadow-lg flex flex-col overflow-hidden shrink-0">
          <div class="h-1.5 w-full bg-gradient-to-r from-green-400 to-cyan-500"></div>

          <div class="p-8 flex flex-col h-full">
            <h2 class="text-2xl font-bold text-slate-800">{{ selectedPlan.title }}</h2>

            <div class="mt-2 mb-4">
              <span class="inline-block bg-gray-100 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                3-days free then:
              </span>
            </div>

            <div class="mt-2 flex items-baseline">
              <span class="text-2xl font-bold text-slate-800 mr-0.5">$</span>
              <span class="text-5xl font-black text-slate-800 tracking-tighter">{{ selectedPlan.price }}</span>
              <span class="text-gray-400 ml-1 font-bold text-lg">/month</span>
            </div>

            <div v-if="selectedPlan.fullPrice" class="mt-2">
              <p class="text-[12px] text-gray-400">
                billed yearly at <span class="line-through text-gray-300">${{ selectedPlan.fullPrice }}</span>
                <span class="font-bold text-gray-500 ml-1">${{ selectedPlan.oldPrice }}</span>
              </p>
            </div>

            <div v-if="selectedPlan.savings" class="self-start bg-green-50 text-green-600 text-[11px] font-black px-3 py-1 rounded-md border border-green-100 mt-4 mb-4">
              ${{ selectedPlan.savings }} in savings
            </div>
            <div v-if="!selectedPlan.fullPrice" class="h-8"></div>

            <div class="h-px w-full bg-gray-100 mb-6 mt-4"></div>

            <ul class="space-y-4">
              <li v-for="feature in selectedPlan.features" :key="feature.main" class="flex items-start">
                <img src="https://api.iconify.design/iconoir:spark-solid.svg?color=%23bef264"
                     class="w-5 h-5 mt-0.5 mr-3 shrink-0" alt="sparkle">
                <div>
                  <p class="text-[13px] text-slate-700 font-bold leading-tight">{{ feature.main }}</p>
                  <p v-if="feature.sub" class="text-[11px] text-gray-400 mt-1 leading-tight">{{ feature.sub }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex-1 bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full">

          <h3 class="text-[17px] font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h3>
          <div class="space-y-2.5 text-sm text-gray-600 mb-4 px-1">
            <div class="flex justify-between">
              <span>{{ selectedPlan.title.split(' - ')[1] }} Plan</span>
              <span>{{ totalDue }}</span>
            </div>
            <div class="flex justify-between text-gray-800">
              <span class="font-bold">Total Due <span class="text-[10px] font-normal text-gray-400 ml-1">(*not including sales tax where applicable)</span></span>
              <span class="font-bold">{{ totalDue }}</span>
            </div>
            <div class="flex justify-between font-bold text-gray-800 pt-1">
              <span>Due Today</span>
              <span>$0.00</span>
            </div>
          </div>
          <div class="bg-gray-100 text-center py-3 rounded text-[13px] text-gray-500 font-medium mb-8">
            Includes 3-Day Free Trial
          </div>

          <h3 class="text-[17px] font-bold text-gray-800 mb-4 border-b pb-2">Billing Information</h3>

          <form @submit.prevent="submitForm">
            <div class="mb-5">
              <label class="block text-[13px] text-gray-600 mb-1">Card Details</label>
              <div class="flex border border-gray-300 rounded-md overflow-hidden bg-white">
                <input type="text" v-model="form.cardNumber" placeholder="Number" class="w-full p-2.5 text-sm bg-transparent outline-none" required />
                <input type="text" v-model="form.expiry" placeholder="MM / YY" class="w-24 p-2.5 text-sm border-l border-gray-300 bg-transparent outline-none" required />
                <input type="text" v-model="form.cvc" placeholder="CVC" class="w-20 p-2.5 text-sm border-l border-gray-300 bg-transparent outline-none" required />
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-[13px] text-gray-600 mb-1">Address</label>
              <div class="border border-gray-300 rounded-md p-4 bg-gray-50">
                <input type="text" v-model="form.fullName" placeholder="Full name" class="w-full p-2.5 text-sm border border-gray-300 rounded mb-3 bg-white outline-none" required />
                <input type="text" v-model="form.address" placeholder="Address" class="w-full p-2.5 text-sm border border-gray-300 rounded bg-white outline-none" />
              </div>
            </div>

            <div class="flex items-start gap-2.5 mb-6 px-1">
              <input type="checkbox" v-model="form.consent" id="consent" class="mt-1 cursor-pointer" required />
              <label for="consent" class="text-[11px] text-gray-500 cursor-pointer text-justify leading-tight">
                I consent to <strong>Terms of Use</strong> and understand my 3-day free trial will automatically convert to {{ totalDue }} per year starting on 04/02/2026. The yearly fee will be automatically charged each year going forward unless I cancel my account at least one (1) business day before the end of the current billing period, which can be done by calling (888) 463-3163.
              </label>
            </div>

            <button
              type="submit"
              class="font-bold py-3 px-6 rounded-md transition-all duration-200 text-sm w-full md:w-auto"
              :class="form.consent ? 'bg-[#e2e2e2] text-slate-800 hover:bg-gray-300 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              :disabled="!form.consent"
            >
              Try It Free
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
