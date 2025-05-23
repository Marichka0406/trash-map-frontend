<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import Map from '../Map/Map.vue'
import TrashMarker from '../TrashMarker/TrashMarker.vue'
import AddTrashMarkModal from '../AddTrashMarkModal/AddTrashMarkModal.vue'
import TrashMarkInfoModal from '../TrashMarkInfoModal/TrashMarkInfoModal.vue'
import { getAllTrashMarks } from '../../services/trashMarkService'
import type { MapTrashMark } from '../../types/trashMark'

const mapRef = ref<{ mapInstance?: any } | null>(null)
const trashMarks = ref<MapTrashMark[]>([])
const mapCenter = ref<[number, number]>([24.0315, 49.8419])
const isLoadingMarks = ref(true)
const isLoadingLocation = ref(true)
const showAddMarkerModal = ref(false)
const isMapReady = ref(false)
const selectedMarkId = ref<string | null>(null)

const openAddMarkerModal = () => {
  showAddMarkerModal.value = true
}

const closeAddMarkerModal = () => {
  showAddMarkerModal.value = false
}

const onCreateMarker = (newMark: MapTrashMark) => {
  trashMarks.value.push(newMark)
  closeAddMarkerModal()
}

const openTrashMarkInfo = (id: string) => {
  selectedMarkId.value = id
}

const goToUserLocation = () => {
  if (!navigator.geolocation) {
    toast.error('Геолокація не підтримується браузером')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      mapCenter.value = [longitude, latitude]
      mapRef.value?.mapInstance?.flyTo({ center: [longitude, latitude], zoom: 16 })
    },
    () => toast.error('Не вдалося отримати місцезнаходження')
  )
}

const fetchTrashMarks = async () => {
  try {
    const marks: MapTrashMark[] = await getAllTrashMarks()
    trashMarks.value = marks
  } catch (err) {
    toast.error('Не вдалося завантажити мітки')
  } finally {
    isLoadingMarks.value = false
  }
}

onMounted(() => {
  fetchTrashMarks()

  if (!navigator.geolocation) {
    isLoadingLocation.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      mapCenter.value = [longitude, latitude]
      isLoadingLocation.value = false
    },
    () => {
      toast.error('Не вдалося визначити місцезнаходження. Використано центр за замовчуванням.')
      isLoadingLocation.value = false
    }
  )
})
</script>

<template>
  <div class="page-container">
    <div v-if="isLoadingMarks || isLoadingLocation" class="loader">
      <div class="spinner"></div>
    </div>

    <Map
      v-else
      ref="mapRef"
      :center="mapCenter"
      :zoom="14"
      :readOnly="true"
      :showControls="true"
      style="height: 100vh;"
      @mapReady="isMapReady = true"
    />

    <TrashMarker
      v-if="isMapReady"
      v-for="mark in trashMarks"
      :key="mark._id"
      :id="mark._id"
      :lng="mark.location.coordinates[0]"
      :lat="mark.location.coordinates[1]"
      :color="mark.status === 'collected' ? '#4caf50' : '#f44336'"
      :map="mapRef?.mapInstance"
      @showInfo="openTrashMarkInfo"
    />

    <TrashMarkInfoModal
      v-if="selectedMarkId"
      :visible="true"
      :markId="selectedMarkId"
      @close="selectedMarkId = null"
      @updateStatus="() => {}"
      @openHistory="() => {}"
    />

    <button class="btn add-marker" @click="openAddMarkerModal" title="Додати мітку">
      <i class="fas fa-plus"></i>
    </button>

    <button class="btn locate-me" @click="goToUserLocation" title="Поточне місцезнаходження">
      <i class="fas fa-location-arrow"></i>
    </button>

    <AddTrashMarkModal
      :visible="showAddMarkerModal"
      @close="closeAddMarkerModal"
      @create="onCreateMarker"
    />
  </div>
</template>

<style scoped>
.page-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.loader {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 25;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(43, 146, 127, 0.3);
  border-top-color: #2b927f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn {
  position: absolute;
  width: 44px;
  height: 44px;
  background-color: #2b927f;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s ease;
  z-index: 30;
}

.btn:hover {
  background-color: #246a62;
}

.add-marker {
  bottom: 2rem;
  left: 1rem;
}

.locate-me {
  bottom: 2rem;
  right: 1rem;
}
</style>
