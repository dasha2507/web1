<template>
  <div class="max-w-[1200px] mx-auto p-6 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-black text-gray-800 uppercase tracking-tight">Таблиця постів (Nuxt UI)</h2>
        <p class="text-sm text-gray-500">Дані безпосередньо з Laravel із серверною пагінацією</p>
      </div>

      <div class="flex gap-2">
        <UButton to="/admin/blog/posts/create" color="primary" variant="solid">
          Додати пост
        </UButton>
      </div>
    </div>

    <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <UTable
        :data="posts"
        :columns="columns"
        :loading="pending"
        class="min-w-[900px]"
      >
        <template #user-cell="{ row }">
          <span class="font-medium text-gray-700">{{ row.original.user?.name || 'Невідомо' }}</span>
        </template>

        <template #category-cell="{ row }">
          <UBadge color="gray" variant="soft">
            {{ row.original.category?.title || 'Без категорії' }}
          </UBadge>
        </template>

        <template #title-cell="{ row }">
          <NuxtLink :to="'/posts/' + row.original.id" class="font-bold text-primary-600 hover:text-primary-800 hover:underline">
            {{ row.original.title }}
          </NuxtLink>
        </template>

        <template #published_at-cell="{ row }">
          <span class="text-sm text-gray-500">{{ row.original.published_at || 'Чорновик' }}</span>
        </template>
      </UTable>
    </div>

    <div class="mt-6 flex justify-between items-center px-2">
      <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Всього записів: {{ total }}
      </span>
      <UPagination
        v-model:page="currentPage"
        :total="total"
        :items-per-page="perPage"
        size="sm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const currentPage = ref(1)
const perPage = ref(10) // Має збігатися з тим, що віддає Laravel ($perPage у репозиторії)
const total = ref(0)
const posts = ref([])
const pending = ref(false)

// Налаштування колонок у стилі TanStack (як у твоєму table.vue)
const columns = [
  { id: 'id', accessorKey: 'id', header: '#' },
  { id: 'user', accessorKey: 'user', header: 'Автор' },
  { id: 'category', accessorKey: 'category', header: 'Категорія' },
  { id: 'title', accessorKey: 'title', header: 'Заголовок' },
  { id: 'published_at', accessorKey: 'published_at', header: 'Дата публікації' }
]

const fetchPosts = async () => {
  pending.value = true
  try {
    // Передаємо page та perPage на бекенд
    const response = await $fetch(`http://127.0.0.1/api/blog/posts?page=${currentPage.value}&perPage=${perPage.value}`)

    // Laravel віддає масив даних у властивості data, а загальну кількість у total
    posts.value = response.data || []
    total.value = response.total || 0

    // Якщо раптом бекенд використовує іншу назву для перпейдж
    if (response.per_page) {
      perPage.value = response.per_page
    }
  } catch (error) {
    console.error('Помилка завантаження постів:', error)
  } finally {
    pending.value = false
  }
}

// Завантажуємо дані при вході на сторінку
onMounted(() => {
  fetchPosts()
})

watch(currentPage, () => {
  fetchPosts()
})
</script>
