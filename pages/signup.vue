<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const { $client } = useNuxtApp()
const { signIn } = useAuth()

const username = ref('')
const password = ref('')

const error = ref(false)

const signup = async () => {
  await $client.signUp.query({
    username: username.value,
    password: password.value
  }).catch(() => {
    error.value = true
  }).then(() => {
    if (error.value) { return }

    signIn(
      'credentials',
      {
        username: username.value,
        password: password.value
      }
    )
    navigateTo('/')
  })
}
</script>
<template>
  <div class="min-w-full min-h-screen flex flex-col items-center justify-center">
    <div class="max-w-sm">
      <h1 class="text-xl">
        Sign Up
      </h1>
      <form class="form-control" @submit.prevent="signup">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Username</span>
          </label>
          <input v-model="username" type="text" placeholder="username" class="input input-bordered">
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input v-model="password" type="password" placeholder="password" class="input input-bordered">
        </div>
        <div class="form-control mt-6">
          <input type="submit" value="Sign Up" class="btn btn-primary">
        </div>
      </form>
      <div v-if="error" class="alert alert-error mt-6">
        <div class="flex-row">
          <ExclamationCircleIcon class="h-6 w-6" />
          <span>Invalid username or password.</span>
        </div>
      </div>
      <div class="mt-6">
        <nuxt-link to="/login" class="link">
          Have an account? Log in here.
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
