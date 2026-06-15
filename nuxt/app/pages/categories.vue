<script setup lang="ts">
import { h, resolveComponent, ref, computed, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'

// Динамічний резолв компонентів для використання всередині колонок UTable (render-функції h)
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UBadge = resolveComponent('UBadge')

// Опис типу об'єкта Категорії
type Category = {
  id: number
  title: string
  slug: string | null
  parent_id: number | null
}

const page = ref(1)
const search = ref('')

// Запит даних із сервера Laravel. Параметри query обгорнуті в computed,
// щоб кожна зміна search або page автоматично викликала новий запит до API.
const { data: response, pending, refresh } = await useFetch<any>('http://localhost/api/admin/blog/categories', {
  lazy: true,
  server: false,
  query: computed(() => ({
    page: page.value,
    search: search.value,
    per_page: 5 // Кількість елементів на сторінку
  }))
})

// Безпечне отримання масиву та мета-даних пагінації з відповіді сервера
const categories = computed<Category[]>(() => response.value?.data || [])
const total = computed(() => response.value?.meta?.total || 0)
const perPage = computed(() => response.value?.meta?.per_page || 5)

// Якщо користувач починає шукати, скидаємо пагінацію на 1 сторінку
watch(search, () => {
  page.value = 1
})

// Конфігурація колонок таблиці Nuxt UI
const columns: TableColumn<Category>[] = [
  {
    accessorKey: 'id',
    header: '#',
    size: 60
  },
  {
    accessorKey: 'title',
    header: 'Назва категорії'
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => {
      const slug = row.original.slug
      return slug
        ? h(UBadge, { color: 'neutral', variant: 'subtle' }, () => slug)
        : h('span', { class: 'text-muted italic text-sm' }, '—')
    }
  },
  {
    id: 'actions',
    header: 'Дії',
    size: 80,
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          items: [
            [
              {
                label: 'Редагувати',
                icon: 'i-heroicons-pencil-square-20-solid',
                onSelect: () => navigateTo(`/admin/blog/categories/${row.original.id}/edit`)
              }
            ],
            [
              {
                label: 'Видалити',
                icon: 'i-heroicons-trash-20-solid',
                color: 'error',
                onSelect: async () => {
                  if (confirm(`Точно видалити категорію "${row.original.title}"?`)) {
                    try {
                      await $fetch(`http://localhost/api/admin/blog/categories/${row.original.id}`, {
                        method: 'DELETE'
                      })
                      refresh() // Перезавантажує дані у таблиці без перезавантаження сторінки
                    } catch (error) {
                      console.error(error)
                      alert('Не вдалося видалити категорію. Можливо, вона містить статті?')
                    }
                  }
                }
              }
            ]
          ]
        },
        () => h(UButton, {
          icon: 'i-heroicons-ellipsis-horizontal-20-solid',
          color: 'neutral',
          variant: 'ghost',
          'aria-label': 'Дії'
        })
      )
    }
  }
]
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight uppercase">Категорії</h1>

      <UButton to="/category-create" color="primary" icon="i-heroicons-plus-20-solid" class="font-bold">
        Додати категорію
      </UButton>
    </div>

    <UCard>
      <template #header>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Пошук категорій..."
          class="max-w-sm"
          column-attribute="title"
        />
      </template>

      <UTable
        :data="categories"
        :columns="columns"
        :loading="pending"
        empty-state-message="Категорій не знайдено"
      />

      <template #footer>
        <div class="flex justify-between items-center px-2" v-if="total > 0">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Всього записів: {{ total }}
          </span>
          <UPagination
            v-model:page="page"
            :total="total"
            :items-per-page="perPage"
            size="sm"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
