<template>
  <div class="max-w-[1200px] mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-black text-gray-800 uppercase tracking-tight">Таблиця товарів</h2>
        <p class="text-sm text-gray-500">Управління списком продуктів та фільтрація</p>
      </div>
      <UInput
        v-model="searchQuery"
        placeholder="Швидкий пошук..."
        icon="i-heroicons-magnifying-glass"
        class="w-80"
      />
    </div>

    <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <UTable
        :data="paginatedRows"
        :columns="columns"
        class="min-w-[900px]"
      >
        <template #thumbnail-cell="{ row }">
          <div class="p-1">
            <img
              :src="row.original.thumbnail"
              alt="Product"
              class="w-12 h-12 object-cover rounded-lg border border-gray-100 shadow-sm"
            />
          </div>
        </template>

        <template #title-cell="{ row }">
          <span class="font-bold text-gray-900">{{ row.original.title }}</span>
        </template>

        <template #description-cell="{ row }">
          <div class="max-w-[250px] truncate text-gray-500 text-sm" :title="row.original.description">
            {{ row.original.description }}
          </div>
        </template>

        <template #rating-cell="{ row }">
          <UBadge
            :color="row.original.rating < 4.5 ? 'red' : 'green'"
            variant="flat"
            size="xs"
            class="font-bold"
          >
            ★ {{ row.original.rating }}
          </UBadge>
        </template>

        <template #price-cell="{ row }">
          <span class="font-black text-gray-900">${{ row.original.price }}</span>
        </template>
      </UTable>
    </div>

    <div class="mt-6 flex justify-between items-center px-2">
      <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
        Знайдено: {{ sortedAndFilteredProducts.length }}
      </span>
      <UPagination
        v-model:page="currentPage"
        :total="sortedAndFilteredProducts.length"
        :items-per-page="itemsPerPage"
        size="sm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { data: productsData } = await useFetch('https://dummyjson.com/products?limit=0')
const allProducts = computed(() => productsData.value?.products || [])


const columns = [
  { id: 'thumbnail', accessorKey: 'thumbnail', header: 'Фото' },
  { id: 'title', accessorKey: 'title', header: 'Назва' },
  { id: 'price', accessorKey: 'price', header: 'Ціна' },
  { id: 'rating', accessorKey: 'rating', header: 'Оцінка' },
  { id: 'category', accessorKey: 'category', header: 'Категорія' },
  { id: 'brand', accessorKey: 'brand', header: 'Бренд' }
]

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6) // Збільшив до 6 для кращого вигляду

const sortedAndFilteredProducts = computed(() => {
  let result = [...allProducts.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product =>
      Object.values(product).some(val => String(val).toLowerCase().includes(query))
    )
  }
  return result
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = currentPage.value * itemsPerPage.value
  return sortedAndFilteredProducts.value.slice(start, end)
})


watch(searchQuery, () => {
  currentPage.value = 1
})
</script>
