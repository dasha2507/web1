<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const router = useRouter()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const isSubmitting = ref(false)
const toast = useToast() // Ініціалізуємо тости

interface ApiResponse {
  success: boolean
  message?: string
}

const { data: categoriesResponse, pending: categoriesPending } = await useFetch<any>(`${apiBase}/admin/blog/categories`, {
  lazy: true,
  server: false,
  query: { per_page: 100 }
})

const categories = computed(() => categoriesResponse.value?.data || [])
const categoryItems = computed(() => {
  return categories.value.map((c: any) => ({
    label: c.title,
    value: c.id
  }))
})

const schema = z.object({
  title: z.string().min(3, 'Заголовок має містити мінімум 3 символи'),
  slug: z.string().optional(),
  category_id: z.number().nullable().optional(),
  excerpt: z.string().optional(),
  content_raw: z.string().min(10, 'Текст статті має бути не коротшим за 10 символів'),
  is_published: z.boolean().default(false)
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  title: '',
  slug: '',
  category_id: null,
  excerpt: '',
  content_raw: '',
  is_published: false
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true

  try {
    await $fetch<ApiResponse>(`${apiBase}/blog/posts`, {
      method: 'POST',
      body: {
        title: event.data.title,
        slug: event.data.slug || null,
        category_id: event.data.category_id,
        excerpt: event.data.excerpt || null,
        content_raw: event.data.content_raw,
        is_published: event.data.is_published
      }
    })

    // Викликаємо успішний тост
    toast.add({
      title: 'Статтю створено!',
      description: `Пост "${event.data.title}" успішно збережено в базі даних.`,
      color: 'success'
    })

    router.push('/BlogPostsUi')
  } catch (error) {
    console.error('Помилка збереження поста:', error)
    toast.add({
      title: 'Помилка збереження',
      description: 'Не вдалося створити статтю. Перевірте правильність даних.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-12 px-4">
    <UCard>
      <template #header>
        <h2 class="font-black text-2xl text-slate-800 uppercase tracking-tight">Створення нової статті</h2>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UFormField label="Заголовок статті" name="title" required>
            <UInput v-model="state.title" placeholder="Введіть крутий заголовок..." class="w-full" size="md" />
          </UFormField>

          <UFormField label="Slug (URL, neoбов'язково)" name="slug">
            <UInput v-model="state.slug" placeholder="cool-article" class="w-full" size="md" />
          </UFormField>
        </div>

        <UFormField label="Категорія" name="category_id">
          <USelect
            v-model.number="state.category_id"
            :items="categoryItems"
            placeholder="Оберіть категорію"
            :loading="categoriesPending"
            class="w-full"
            size="md"
          />
        </UFormField>

        <UFormField label="Короткий анонс" name="excerpt">
          <UTextarea v-model="state.excerpt" placeholder="Про що ця стаття в двох словах?" :rows="2" class="w-full" />
        </UFormField>

        <UFormField label="Текст статті" name="content_raw" required>
          <UTextarea v-model="state.content_raw" placeholder="Пишіть свій шедевр тут..." :rows="8" class="w-full" />
        </UFormField>

        <UFormField name="is_published">
          <div class="flex items-center gap-2">
            <UToggle v-model="state.is_published" size="lg" color="success" />
            <span class="text-sm font-medium text-gray-700">Опублікувати одразу</span>
          </div>
        </UFormField>

        <div class="flex gap-4 pt-6 border-t border-gray-100">
          <UButton type="submit" color="primary" :loading="isSubmitting" icon="i-heroicons-check-20-solid" class="px-6 font-bold">
            Зберегти пост
          </UButton>

          <UButton to="/BlogPostsUi" color="neutral" variant="ghost" class="font-semibold">
            Скасувати
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
