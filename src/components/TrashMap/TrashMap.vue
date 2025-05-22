<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import Map from '../Map/Map.vue'
import AddTrashMarkModal from '../AddTrashMarkModal/AddTrashMarkModal.vue'

interface Marker {
  lng: number
  lat: number
  color?: string
}

interface TrashMark {
  status: 'collected' | 'not collected'
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
}

const trashMarksFromBackend: TrashMark[] = [
  { status: 'not collected', location: { type: 'Point', coordinates: [24.0315, 49.8419] } },
  { status: 'collected', location: { type: 'Point', coordinates: [24.0283, 49.8425] } },
  { status: 'collected', location: { type: 'Point', coordinates: [24.0370, 49.8395] } }
]

const mapRef = ref<{ mapInstance?: any } | null>(null)

const allMarkers = ref<Marker[]>(
  trashMarksFromBackend.map(mark => ({
    lng: mark.location.coordinates[0],
    lat: mark.location.coordinates[1],
    color: mark.status === 'collected' ? '#4caf50' : '#f44336'
  }))
)

const filteredMarkers = ref<Marker[]>([...allMarkers.value])
const mapCenter = ref<[number, number]>([24.0315, 49.8419])
const isLoading = ref(true)

const showAddMarkerModal = ref(false)

const openAddMarkerModal = () => {
  showAddMarkerModal.value = true
}

const closeAddMarkerModal = () => {
  showAddMarkerModal.value = false
}

const onCreateMarker = (markerData: { lng: number; lat: number; description: string; photo: File | null }) => {
  allMarkers.value.push({
    lng: markerData.lng,
    lat: markerData.lat,
    color: '#f44336'
  })
  filteredMarkers.value = [...allMarkers.value]
  toast.success('Мітку створено')
  closeAddMarkerModal()
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

onMounted(() => {
  if (!navigator.geolocation) {
    isLoading.value = false
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      mapCenter.value = [longitude, latitude]
      isLoading.value = false
    },
    () => {
      toast.error('Не вдалося визначити початкове місцезнаходження. Використано центр за замовчуванням.')
      isLoading.value = false
    }
  )
})
</script>

<template>
  <div class="page-container">

    <div v-if="isLoading" class="loader">
      <div class="spinner"></div>
    </div>

    <Map
      v-else
      ref="mapRef"
      :center="mapCenter"
      :zoom="14"
      :markers="filteredMarkers"
      :readOnly="true"
      :showControls="true"
      style="height: 100vh;"
    />

    <button class="btn add-marker" @click="openAddMarkerModal" title="Додати мітку">
      <i class="fas fa-plus"></i>
    </button>

    <button class="btn locate-me" @click="goToUserLocation" title="Поточне місцезнаходження">
      <i class="fas fa-location-arrow"></i>
    </button>

    <!-- Модалка додавання мітки -->
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
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
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
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
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
