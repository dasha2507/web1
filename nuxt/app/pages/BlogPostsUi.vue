<script setup lang="ts">
import { h, resolveComponent, ref, computed, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'

// Динамічний резолв компонентів Nuxt UI та вбудованого NuxtLink
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UBadge = resolveComponent('UBadge')
const NuxtLink = resolveComponent('NuxtLink')

// Ініціалізуємо сервіс тостів
const toast = useToast()

type Post = {
  id: number
  title: string
  slug: string
  is_published: boolean
  published_at: string | null
  excerpt: string | null
  content_raw: string
  user_id: number
  category_id: number
  user: { name: string }
  category: { title: string }
}

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const page = ref(1)
const search = ref('')

const { data: response, pending, refresh } = await useFetch<any>(`${apiBase}/blog/posts`, {
  lazy: true,
  server: false,
  query: computed(() => ({
    page: page.value,
    search: search.value,
    perPage: 10
  }))
})

const posts = computed<Post[]>(() => response.value?.data || [])
const total = computed(() => response.value?.meta?.total || 0)
const perPage = computed(() => response.value?.meta?.per_page || 10)

watch(search, () => {
  page.value = 1
})

const columns: TableColumn<Post>[] = [
  {
    accessorKey: 'id',
    header: '#',
    size: 60
  },
  {
    id: 'user',
    header: 'Автор',
    cell: ({ row }) => h('span', { class: 'font-medium text-gray-700' }, row.original.user?.name || 'Невідомо')
  },
  {
    id: 'category',
    header: 'Категорія',
    cell: ({ row }) => h(UBadge, { color: 'neutral', variant: 'soft' }, () => row.original.category?.title || 'Без категорії')
  },
  {
    accessorKey: 'title',
    header: 'Заголовок',
    cell: ({ row }) => {
      return h(
        NuxtLink,
        {
          to: `/posts/${row.original.id}`,
          class: 'font-bold text-primary-600 hover:text-primary-800 hover:underline transition-colors cursor-pointer'
        },
        () => row.original.title
      )
    }
  },
  {
    id: 'status',
    header: 'Статус',
    cell: ({ row }) => {
      const isPub = row.original.is_published
      return h(UBadge, { color: isPub ? 'success' : 'warning', variant: 'subtle' }, () => isPub ? 'Опубліковано' : 'Чернетка')
    }
  },
  {
    accessorKey: 'published_at',
    header: 'Дата публікації',
    cell: ({ row }) => h('span', { class: 'text-sm text-gray-500' }, row.original.published_at || '—')
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
                onSelect: () => navigateTo(`/admin/blog/posts/${row.original.id}/edit`)
              }
            ],
            [
              {
                label: 'Видалити',
                icon: 'i-heroicons-trash-20-solid',
                color: 'error',
                onSelect: async () => {
                  if (confirm(`Ви впевнені, що хочете видалити статтю "${row.original.title}"?`)) {
                    try {
                      await $fetch(`${apiBase}/blog/posts/${row.original.id}`, { method: 'DELETE' })

                      // Викликаємо успішний тост після видалення
                      toast.add({
                        title: 'Успішно видалено',
                        description: `Статтю "${row.original.title}" було назавжди видалено.`,
                        color: 'success'
                      })

                      refresh()
                    } catch (error) {
                      console.error(error)
                      toast.add({
                        title: 'Помилка видалення',
                        description: 'Не вдалося видалити статтю з сервера.',
                        color: 'error'
                      })
                    }
                  }
                }
              }
            ]
          ]
        },
        () => h(UButton, { icon: 'i-heroicons-ellipsis-horizontal-20-solid', color: 'neutral', variant: 'ghost' })
      )
    }
  }
]
</script>

<template>
  <div class="max-w-[1200px] mx-auto p-6 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-black text-gray-800 uppercase tracking-tight">Таблиця постів</h2>
        <p class="text-sm text-gray-500">Серверна пагінація та керування статтями через Docker Sail</p>
      </div>
      <UButton to="/admin/blog/posts/create" color="primary" variant="solid" icon="i-heroicons-plus-20-solid" class="font-bold">
        Додати post
      </UButton>
    </div>

    <UCard>
      <template #header>
        <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Пошук статей за заголовком..." class="max-w-sm" />
      </template>

      <ClientOnly>
        <UTable :data="posts" :columns="columns" :loading="pending" empty-state-message="Статей не знайдено" />
      </ClientOnly>

      <template #footer>
        <div class="flex justify-between items-center px-2" v-if="total > 0">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Всього записів: {{ total }}</span>
          <UPagination v-model:page="page" :total="total" :items-per-page="perPage" size="sm" />
        </div>
      </template>
    </UCard>
  </div>
</template>
