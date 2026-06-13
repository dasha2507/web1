<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="navbar bg-gray-100 p-4 mb-4 rounded flex justify-between items-center">
          <span class="font-bold text-gray-700">Управління блогом</span>
          <a href="/admin/blog/posts/create" class="text-blue-600 font-bold hover:underline">Додати пост</a>
        </nav>
        <div class="card bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div class="card-body p-0">
            <div class="overflow-x-auto">
              <table class="table-auto w-full text-left border-collapse">
                <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="p-4 text-sm font-semibold text-gray-600">#</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Автор</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Категорія</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Заголовок</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Дата публікації</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 transition-colors">
                  <td class="p-4 text-sm">{{ post.id }}</td>
                  <td class="p-4 text-sm">{{ post.user?.name || 'Невідомо' }}</td>
                  <td class="p-4 text-sm">{{ post.category?.title || 'Без категорії' }}</td>
                  <td class="p-4 text-sm">
                    <NuxtLink :to="'/posts/' + post.id" class="text-blue-500 hover:text-blue-700 font-medium">
                      {{ post.title }}
                    </NuxtLink>
                  </td>
                  <td class="p-4 text-sm text-gray-500">{{ post.published_at || 'Чорновик' }}</td>
                </tr>
                <tr v-if="posts.length === 0">
                  <td colspan="5" class="p-8 text-center text-gray-500">
                    Дані відсутні або завантажуються...
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const posts = ref([]);

const getPosts = async () => {
  try {
    // Звертаємось безпосередньо до твого Laravel API
    const response = await $fetch('http://127.0.0.1/api/blog/posts');
    console.log('Відповідь API:', response);

    posts.value = response.data || [];
  } catch (error) {
    console.error('Помилка отримання постів:', error);
  }
};

onMounted(() => {
  getPosts();
});
</script>
