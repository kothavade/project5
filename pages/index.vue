<script setup lang="ts">
import { Contact } from '@prisma/client'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import { TrashIcon, PencilSquareIcon, PlusIcon, HomeIcon, PhoneIcon, EnvelopeIcon, CheckIcon, NoSymbolIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
const { $client } = useNuxtApp()
const { status, signIn } = useAuth()

const contacts = ref<Contact[]>([])

const getContacts = async () => {
  return await $client.contacts.contacts.query()
}

onMounted(async () => {
  contacts.value = await getContacts()
  const [first] = contacts.value
  center.value = [first.latitude, first.longitude]
})

// TODO: Use same one as in app.vue
const isAuth = computed(() => status.value === 'authenticated')

const deleteContact = async (id: number) => {
  if (!isAuth.value) {
    signIn()
    return
  }
  await $client.contacts.delete.query({ id })
  contacts.value = await getContacts()
}

const center = ref<[number, number]>([0, 0])
const map = ref(null)
// TODO: Real flyTo, seems impossible with Vue Leaflet
const setCenter = (lat: number, lng: number) => {
  center.value = [lat, lng]
}
</script>

<script lang="ts">

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      zoom: 7
    }
  }
}

</script>

<!-- TODO: Extract elements into seperate components -->
<template>
  <div>
    <div class="w-full" style="height: 50vh">
      <l-map
        ref="map"
        v-model:zoom="zoom"
        class="rounded-box z-0"
        :center="center"
        :use-global-leaflet="false"
        :options="{attributionControl: false}"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        />
        <l-marker v-for="contact in contacts" :key="contact.id" :lat-lng="[contact.latitude, contact.longitude]">
          <l-popup class="card card-compact">
            <div class="card-body">
              <h2 class="card-title">
                {{ contact.firstName }} {{ contact.lastName }}
              </h2>
              <code class="text-muted">
                <div> {{ contact.longitude.toFixed(5) }} {{ contact.latitude.toFixed(5) }}</div>
              </code>
              <p>
                {{ contact.address }}
              </p>
              <div class="flex space-x-4">
                <div :class="contact.contactByMail ? 'tooltip text-green-500' : 'tooltip text-red-500'" :data-tip="contact.address">
                  <HomeIcon class="w-5 h-5" />
                </div>
                <div :class="contact.contactByEmail ? 'tooltip text-green-500' : 'tooltip text-red-500'" :data-tip="contact.email">
                  <EnvelopeIcon class="w-5 h-5" />
                </div>
                <div :class="contact.contactByPhone ? 'tooltip text-green-500' : 'tooltip text-red-500'" :data-tip="contact.phone">
                  <PhoneIcon class="w-5 h-5" />
                </div>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
    <div class="overflow-auto mt-5" style="max-height: 35vh">
      <table class="table table-normal w-full">
        <thead class="sticky top-0 z-10">
          <tr>
            <th v-if="isAuth" />
            <th>Name</th>
            <th class="flex flex-row align-middle items-center">
              <div class="flex-1">
                Contact Info
              </div>
              <div class="flex-none">
                <button class="btn" @click="navigateTo('/add')">
                  <PlusIcon class="w-5 h-5" />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in contacts" :key="contact.id" class="hover cursor-pointer" @click="setCenter(contact.latitude, contact.longitude)">
            <td v-if="isAuth" class="sticky left-0">
              <div class="flex justify-center flex-col space-y-4">
                <div class="tooltip" data-tip="Edit">
                  <button class="btn btn-primary" @click.stop="navigateTo(`/${contact.id}`)">
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                </div>
                <div class="tooltip" data-tip="Delete">
                  <label :for="`delete-${contact.id}`" class="btn btn-error" @click.stop="">
                    <TrashIcon class="w-5 h-5" />
                  </label>
                </div>
              </div>
            </td>
            <td> {{ contact.firstName }} {{ contact.lastName }} </td>
            <td>
              <div class="space-y-4">
                <!-- TODO: Make this not need 60 lines -->
                <div v-if="contact.contactByMail" class="flex flex-row space-x-4 align-middle rounded-box p-5 bg-green-200">
                  <div class="tooltip" data-tip="Contactable By Mail">
                    <CheckIcon class="w-5 h-5" />
                  </div>
                  <div class="divider divider-horizontal" />
                  <div class="tooltip" data-tip="Address">
                    <HomeIcon class="w-5 h-5" />
                  </div>
                  <p> {{ contact.address }} </p>
                </div>
                <div v-else class="flex flex-row space-x-4 align-middle rounded-box p-5 bg-red-200">
                  <div class="tooltip" data-tip="Not Contactable By Mail">
                    <NoSymbolIcon v-if="!contact.contactByMail" class="w-5 h-5" />
                  </div>
                  <div class="divider divider-horizontal" />
                  <div class="tooltip" data-tip="Address">
                    <HomeIcon class="w-5 h-5" />
                  </div>
                  <p> {{ contact.address }} </p>
                </div>
                <div class="flex flex-row space-x-4">
                  <div v-if="contact.contactByPhone" class="flex-auto flex flex-row space-x-4 align-middle rounded-box p-5 bg-green-200">
                    <div class="tooltip" data-tip="Contactable By Phone">
                      <CheckIcon class="w-5 h-5" />
                    </div>
                    <div class="divider divider-horizontal" />
                    <div class="tooltip" data-tip="Phone">
                      <PhoneIcon class="w-5 h-5" />
                    </div>
                    <p> {{ contact.phone }} </p>
                  </div>
                  <div v-else class="flex-auto flex flex-row space-x-4 align-middle rounded-box p-5 bg-red-200">
                    <div class="tooltip" data-tip="Not Contactable By Phone">
                      <NoSymbolIcon v-if="!contact.contactByPhone" class="w-5 h-5" />
                    </div>
                    <div class="divider divider-horizontal" />
                    <div class="tooltip" data-tip="Phone">
                      <PhoneIcon class="w-5 h-5" />
                    </div>
                    <p> {{ contact.phone }} </p>
                  </div>
                  <div v-if="contact.contactByEmail" class="flex-auto flex flex-row space-x-4 align-middle rounded-box p-5 bg-green-200">
                    <div class="tooltip" data-tip="Contactable By Email">
                      <CheckIcon class="w-5 h-5" />
                    </div>
                    <div class="divider divider-horizontal" />
                    <div class="tooltip" data-tip="Email">
                      <EnvelopeIcon class="w-5 h-5" />
                    </div>
                    <p> {{ contact.email }} </p>
                  </div>
                  <div v-else class="flex-auto flex flex-row space-x-4 align-middle rounded-box p-5 bg-red-200">
                    <div class="tooltip" data-tip="Not Contactable By Email">
                      <NoSymbolIcon v-if="!contact.contactByEmail" class="w-5 h-5" />
                    </div>
                    <div class="divider divider-horizontal" />
                    <div class="tooltip" data-tip="Email">
                      <EnvelopeIcon class="w-5 h-5" />
                    </div>
                    <p> {{ contact.email }} </p>
                  </div>
                </div>
              </div>
            </td>
            <input :id="`delete-${contact.id}`" type="checkbox" class="modal-toggle">
            <label :for="`delete-${contact.id}`" class="modal">
              <div class="modal-box relative">
                <p class="text-lg font-bold">Are you sure you want to delete {{ contact.firstName }} {{ contact.lastName }}?</p>
                <div class="modal-action">
                  <label :for="`delete-${contact.id}`" class="btn">Cancel</label>
                  <button class="btn btn-error" @click.stop="deleteContact(contact.id)">Delete</button>
                </div>
              </div>
            </label>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
