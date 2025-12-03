<template>
  <div class="comment-card">
    <div class="comment-header">
      <span class="comment-username">{{ comment.user_name }}</span>
    </div>
    <div class="comment-content">{{ comment.content }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  comment: {
    id: number
    user_name: string
    content: string
  }
}>()
</script>

<style scoped>
.comment-card {
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-username {
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 5px;
  display: block;
}

.comment-content {
  color: #ffffff;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

