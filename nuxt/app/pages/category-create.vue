<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const router = useRouter()
const isSubmitting = ref(false)

// Описуємо інтерфейс відповіді від Laravel сервера
interface ApiResponse {
  success: boolean
  message: string
  id?: number
}

const schema = z.object({
  title: z.string().min(3, 'Назва має містити мінімум 3 символи'),
  slug: z.string().optional()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({ title: '', slug: '' })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true

  try {
    // Передаємо <ApiResponse> як дженерик, щоб TypeScript бачив поля .success та .message
    const result = await $fetch<ApiResponse>('http://localhost/api/admin/blog/categories', {
      method: 'POST',
      body: {
        title: event.data.title,
        slug: event.data.slug || null
      }
    })

    if (result && result.success) {
      router.push('/categories')
    } else {
      alert('Помилка: ' + (result.message || 'Не вдалося створити'))
    }
  } catch (error) {
    console.error('Помилка:', error)
    alert('Помилка з\'єднання з сервером.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <UCard>
      <template #header>
        <h2 class="font-bold text-2xl text-slate-800">Створення нової категорії</h2>
      </template>

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
            Створити
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
