<script setup lang="ts">
import { Contact } from '@prisma/client'
const { $client } = useNuxtApp()
const contact = ref<Contact>({} as Contact)
const addContact = async () => {
  try {
    const tmpContact: Contact = {
      ...contact.value,
      contactByMail: !!contact.value.contactByMail,
      contactByPhone: !!contact.value.contactByPhone,
      contactByEmail: !!contact.value.contactByEmail,
      latitude: 0,
      longitude: 0
    }
    await $client.contacts.create.query(tmpContact)
    navigateTo('/')
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="col-span-1 md:col-span-1">
        <label for="title" class="label">Title</label>
        <select id="title" v-model="contact.title" class="select">
          <option value="Mr.">
            Mr.
          </option>
          <option value="Mrs.">
            Mrs.
          </option>
          <option value="Ms.">
            Ms.
          </option>
          <option value="Dr.">
            Dr.
          </option>
        </select>
      </div>
      <div class="col-span-1 md:col-span-1">
        <label for="firstName" class="label">
          <span class="label-text">First Name</span>
        </label>
        <input id="firstName" v-model="contact.firstName" type="text" class="input">
      </div>
      <div class="col-span-1 md:col-span-1">
        <label for="lastName" class="label">
          <span class="label-text">Last Name</span>
        </label>
        <input id="lastName" v-model="contact.lastName" type="text" class="input">
      </div>
      <div class="col-span-1" />
      <div class="col-span-1">
        <label for="phone" class="label">
          <span class="label-text">Phone</span>
        </label>
        <input id="phone" v-model="contact.phone" type="text" class="input">
      </div>
      <div class="col-span-1">
        <label for="email" class="label">
          <span class="label-text">Email</span>
        </label>
        <input id="email" v-model="contact.email" type="text" class="input">
      </div>
      <div class="col-span-1 md:col-span-3">
        <label for="address" class="label">
          <span class="label-text">Address</span>
        </label>
        <div class="flex space-x-2">
          <input id="address" v-model="contact.address" type="text" class="input grow">
        </div>
      </div>
      <div class="col-span-1 md:col-span-1">
        <label for="contactByMail" class="label cursor-pointer">
          <span class="label-text">Contact By Mail</span>
        </label>
        <input id="contactByMail" v-model="contact.contactByMail" type="checkbox" class="toggle">
      </div>
      <div class="col-span-1 md:col-span-1">
        <label for="contactByPhone" class="label cursor-pointer">
          <span class="label-text">Contact By Phone</span>
        </label>
        <input id="contactByPhone" v-model="contact.contactByPhone" type="checkbox" class="toggle">
      </div>
      <div class="col-span-1 md:col-span-1">
        <label for="contactByEmail" class="label cursor-pointer">
          <span class="label-text">Contact By Email</span>
        </label>
        <input id="contactByEmail" v-model="contact.contactByEmail" type="checkbox" class="toggle">
      </div>
    </div>
    <div class="mt-4">
      <button class="btn btn-primary" @click="addContact">
        Add Contact
      </button>
    </div>
  </div>
</template>
