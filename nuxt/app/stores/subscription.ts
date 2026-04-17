import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubscriptionStore = defineStore('subscription', () => {
  const selectedPlan = ref(null)

  function setPlan(plan: any) {
    selectedPlan.value = plan
  }

  return {
    selectedPlan,
    setPlan
  }
})
