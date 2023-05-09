<template>
  <div>
    <div>I'm protected! Session data: {{ data }}</div>
    <button class="p-2 m-2 shadow-xl rounded-xl" @click="signOut()">
      sign out
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data, signOut } = useAuth()

</script>
