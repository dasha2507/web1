<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const router = useRouter()
const route = useRoute()
const categoryId = route.params.id as string

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const isSubmitting = ref(false)
const isLoading = ref(true)
const toast = useToast() // Ініціалізуємо тости

interface ApiResponse {
  success: boolean
  message: string
}

interface CategoryData {
  id: number
  title: string
  slug: string | null
  parent_id: number | null
}

const schema = z.object({
  title: z.string().min(3, 'Назва має містити мінімум 3 символи'),
  slug: z.string().optional()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({ title: '', slug: '' })

onMounted(async () => {
  try {
    const response = await $fetch<{ data: CategoryData }>(`${apiBase}/admin/blog/categories/${categoryId}`)
    const category = response.data ?? response

    state.title = category.title
    state.slug = category.slug || ''
  } catch (error) {
    console.error('Помилка завантаження категорії:', error)
    toast.add({
      title: 'Помилка завантаження',
      description: 'Не вдалося завантажити дані категорії.',
      color: 'error'
    })
    router.push('/categories')
  } finally {
    isLoading.value = false
  }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true

  try {
    const result = await $fetch<ApiResponse>(`${apiBase}/admin/blog/categories/${categoryId}`, {
      method: 'PUT',
      body: {
        title: event.data.title,
        slug: event.data.slug || null
      }
    })

    if (result && result.success) {
      toast.add({
        title: 'Категорію оновлено!',
        description: `Зміни для "${event.data.title}" успішно збережено.`,
        color: 'success'
      })
      router.push('/categories')
    } else {
      toast.add({
        title: 'Помилка оновлення',
        description: result.message || 'Не вдалося оновити категорію.',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Помилка:', error)
    toast.add({
      title: 'Помилка з\'єднання',
      description: 'Не вдалося зв\'язатися з сервером Laravel.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <UCard>
      <template #header>
        <h2 class="font-bold text-2xl text-slate-800">Редагування категорії</h2>
      </template>

      <div v-if="isLoading" class="text-center py-8 text-gray-400">
        Завантаження...
      </div>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">

        <UFormField label="Назва категорії" name="title" required>
          <UInput v-model="state.title" placeholder="Наприклад: Новини" class="w-full" size="md" />
        </UFormField>

        <UFormField label="Slug (необов'язково)" name="slug">
          <UInput v-model="state.slug" placeholder="novyny" class="w-full" size="md" />
        </UFormField>

        <div class="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <UButton
            type="submit"
            color="primary"
            :loading="isSubmitting"
            class="px-6 font-bold"
          >
            Зберегти
          </UButton>

          <UButton
            to="/categories"
            color="neutral"
            variant="ghost"
            class="font-semibold"
          >
            Скасувати
          </UButton>
        </div>

      </UForm>
    </UCard>
  </div>
</template>
