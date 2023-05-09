<script setup lang="ts">
import { ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
const { signIn } = useAuth()

const username = ref('')
const password = ref('')

const error = useRoute().query.error
const isInvalidLogin = computed(() => error === 'CredentialsSignin')
const isUnauthorized = computed(() => error === 'undefined')

const login = () => {
  signIn(
    'credentials',
    {
      username: username.value,
      password: password.value
    }
  )
  navigateTo('/')
}
</script>
<template>
  <div class="min-w-full min-h-screen flex flex-col items-center justify-center">
    <div class="max-w-sm">
      <h1 class="text-xl">
        Sign In
      </h1>
      <form class="form-control" @submit.prevent="login">
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
          <input type="submit" value="Sign In" class="btn btn-primary">
        </div>
      </form>
      <div v-if="isInvalidLogin" class="alert alert-error mt-6">
        <div class="flex-row">
          <ExclamationCircleIcon class="h-6 w-6" />
          <span>Invalid username or password.</span>
        </div>
      </div>
      <div v-if="isUnauthorized" class="alert alert-info mt-6">
        <div class="flex-row">
          <InformationCircleIcon class="h-6 w-6" />
          <span>To access edit and delete, you must be logged in.</span>
        </div>
      </div>

      <div class="mt-6">
        <nuxt-link to="/signup" class="link">
          Don't have an account? Sign up here.
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
