<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <NuxtLink to="/BlogPostsUi" class="text-blue-600 hover:underline font-medium">
        &larr; Повернутися до списку
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-gray-500 text-lg">
      Завантаження даних поста...
    </div>

    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded">
      Помилка: Запис не знайдено.
    </div>

    <div v-else-if="post" class="bg-white shadow-md rounded-lg p-8 border border-gray-100">
      <div class="border-b pb-4 mb-6">
        <h1 class="text-3xl font-bold mb-3 text-gray-900">{{ post.title }}</h1>
        <div class="flex gap-4 text-sm text-gray-500">
          <span><strong>ID:</strong> {{ post.id }}</span>
          <span><strong>Автор:</strong> {{ post.user?.name || 'Невідомо' }}</span>
          <span><strong>Категорія:</strong> {{ post.category?.title || 'Без категорії' }}</span>
          <span><strong>Опубліковано:</strong> {{ post.published_at || 'Чорновик' }}</span>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-bold text-lg mb-2 text-gray-800">Короткий опис (Excerpt):</h3>
        <p class="text-gray-600 italic bg-gray-50 p-4 rounded-md border border-gray-200">
          {{ post.excerpt || 'Опис відсутній...' }}
        </p>
      </div>

      <div>
        <h3 class="font-bold text-lg mb-2 text-gray-800">Основний текст (Content):</h3>
        <div class="text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
          {{ post.content_raw || 'Текст відсутній...' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const postId = route.params.id

const { data: response, pending, error } = await useFetch(`http://127.0.0.1/api/blog/posts/${postId}`)

const post = computed(() => response.value?.data || null)
</script>
