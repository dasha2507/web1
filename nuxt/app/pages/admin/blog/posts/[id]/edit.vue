<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const postId = route.params.id
const isSubmitting = ref(false)
const toast = useToast() // Ініціалізуємо тости

interface ApiResponse {
  success: boolean
  message?: string
}

const { data: postResponse, pending: postPending } = await useFetch<any>(`${apiBase}/blog/posts/${postId}`, {
  lazy: true,
  server: false
})

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

watch(postResponse, (newData) => {
  if (newData?.data) {
    const post = newData.data
    state.title = post.title || ''
    state.slug = post.slug || ''
    state.category_id = post.category_id || null
    state.excerpt = post.excerpt || ''
    state.content_raw = post.content_raw || ''
    state.is_published = !!post.is_published
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true

  try {
    await $fetch<ApiResponse>(`${apiBase}/blog/posts/${postId}`, {
      method: 'PUT',
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
      title: 'Зміни збережено!',
      description: `Статтю "${event.data.title}" успішно оновлено.`,
      color: 'success'
    })

    router.push('/BlogPostsUi')
  } catch (error) {
    console.error('Помилка оновлення поста:', error)
    toast.add({
      title: 'Помилка оновлення',
      description: 'Не вдалося зберегти зміни на сервері.',
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
        <div class="flex justify-between items-center">
          <h2 class="font-black text-2xl text-slate-800 uppercase tracking-tight">Редагування статті</h2>
          <span v-if="postPending" class="text-sm text-gray-400 animate-pulse">Завантаження даних...</span>
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UFormField label="Заголовок статті" name="title" required>
            <UInput v-model="state.title" placeholder="Введіть заголовок..." class="w-full" size="md" :loading="postPending" />
          </UFormField>

          <UFormField label="Slug (URL, необов'язково)" name="slug">
            <UInput v-model="state.slug" placeholder="slug-url" class="w-full" size="md" :loading="postPending" />
          </UFormField>
        </div>

        <UFormField label="Категорія" name="category_id">
          <USelect
            v-model.number="state.category_id"
            :items="categoryItems"
            placeholder="Оберіть категорію"
            :loading="categoriesPending || postPending"
            class="w-full"
            size="md"
          />
        </UFormField>

        <UFormField label="Короткий анонс" name="excerpt">
          <UTextarea v-model="state.excerpt" placeholder="Короткий опис..." :rows="2" class="w-full" :disabled="postPending" />
        </UFormField>

        <UFormField label="Текст статті" name="content_raw" required>
          <UTextarea v-model="state.content_raw" placeholder="Текст статті..." :rows="8" class="w-full" :disabled="postPending" />
        </UFormField>

        <UFormField name="is_published">
          <div class="flex items-center gap-2">
            <UToggle v-model="state.is_published" size="lg" color="success" :disabled="postPending" />
            <span class="text-sm font-medium text-gray-700">Опубліковано</span>
          </div>
        </UFormField>

        <div class="flex gap-4 pt-6 border-t border-gray-100">
          <UButton type="submit" color="primary" :loading="isSubmitting" icon="i-heroicons-check-20-solid" class="px-6 font-bold">
            Зберегти зміни
          </UButton>

          <UButton to="/BlogPostsUi" color="neutral" variant="ghost" class="font-semibold">
            Скасувати
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
