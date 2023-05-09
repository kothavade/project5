<script setup>
import { UserCircleIcon } from '@heroicons/vue/24/outline'
const { status, data, signIn, signOut } = useAuth()
const isAuth = computed(() => status.value === 'authenticated')
</script>

<template>
  <div class="m-5">
    <div class="navbar bg-neutral text-neutral-content rounded-box mb-5">
      <div class="flex-1">
        <nuxt-link class="btn btn-ghost normal-case text-xl" href="/">
          Contacts
        </nuxt-link>
      </div>
      <div class="flex-none">
        <div v-if="isAuth">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost">
              <div class="flex space-x-2 items-center">
                <p>{{ data.user.name }}</p>
                <UserCircleIcon class="w-7 h-7" />
              </div>
            </label>
            <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 text-neutral rounded-box w-52">
              <li><a @click="signOut">Logout</a></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <button class="btn btn-ghost" @click="signIn">
            Sign In
          </button>
        </div>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>
