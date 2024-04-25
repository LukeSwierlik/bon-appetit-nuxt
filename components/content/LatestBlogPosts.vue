<script setup lang="ts">
defineProps({
  limit: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <BlogPosts v-slot="{ posts }" :limit="limit">
    <div v-for="post in posts" :key="post.id">
      <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
    </div>
  </BlogPosts>
</template>
