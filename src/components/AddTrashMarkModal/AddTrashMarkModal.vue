<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { toast } from 'vue3-toastify'
import Map from '../Map/Map.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'create'])

const markerLng = ref(0)
const markerLat = ref(0)
const description = ref('')
const photoFiles = ref<File[]>([])
const photoPreviews = ref<string[]>([])

const descriptionBlock = ref<HTMLElement | null>(null)

const removePhoto = (index: number) => {
  photoFiles.value.splice(index, 1)
  photoPreviews.value.splice(index, 1)
}

const getUserLocation = () => {
  if (!navigator.geolocation) {
    toast.error('Геолокація не підтримується')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      markerLat.value = pos.coords.latitude
      markerLng.value = pos.coords.longitude
    },
    () => {
      toast.error('Не вдалося визначити місцезнаходження')
    }
  )
}

const onMarkerMoved = ({ lng, lat }: { lng: number; lat: number }) => {
  markerLng.value = lng
  markerLat.value = lat
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files) return

  const files = Array.from(input.files)

  if (photoFiles.value.length + files.length > 5) {
    toast.warning('Максимум 5 фото')
    return
  }

  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        photoFiles.value.push(file)
        photoPreviews.value.push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  })
}

const submit = () => {
  if (!description.value.trim()) {
    toast.warning('Будь ласка, додайте опис')
    return
  }

  emit('create', {
    lng: markerLng.value,
    lat: markerLat.value,
    description: description.value,
    photos: photoFiles.value
  })

  close()
}

const close = () => {
  emit('close')
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    getUserLocation()
    description.value = ''
    photoFiles.value = []
    photoPreviews.value = []

    nextTick(() => {
      descriptionBlock.value?.scrollIntoView({ behavior: 'smooth' })
    })
  }
})
</script>

<template>
  <div
    v-if="visible"
    class="modal fade show d-block"
    tabindex="-1"
    @click.self="close"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered custom-modal-md" role="document">
      <div class="modal-content shadow-lg rounded-4">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title">Створи нову позначку</h5>
          <button type="button" class="btn-close" aria-label="Закрити" @click="close"></button>
        </div>

        <div class="modal-body py-0">
          <!-- Карта -->
          <div class="mb-4">
            <Map
              :center="[markerLng, markerLat]"
              :zoom="16"
              :readOnly="false"
              :editableMarker="true"
              :constrainRadiusMeters="200"
              :height="'250px'"
              :showControls="false"
              @markerMoved="onMarkerMoved"
              class="rounded-3 border"
            />
          </div>

          <div class="scrollable-content px-1" ref="descriptionBlock">
            <div class="mb-3">
              <label for="description" class="form-label">Опис</label>
              <textarea
                id="description"
                class="form-control"
                rows="3"
                v-model="description"
                placeholder="Додайте короткий опис мітки..."
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="photo" class="form-label">Фото (до 5)</label>
              <input
                type="file"
                class="form-control"
                id="photo"
                accept="image/png, image/jpeg"
                multiple
                @change="onFileChange"
                :disabled="photoPreviews.length >= 5"
              />

              <div class="mt-3 d-flex flex-wrap gap-2">
                <div
                  v-for="(src, i) in photoPreviews"
                  :key="i"
                  class="photo-thumb position-relative"
                >
                  <img :src="src" class="w-100 h-100 object-fit-cover rounded" alt="Фото" />
                  <button
                    class="btn-close btn-close-white position-absolute top-0 end-0 m-1"
                    @click.stop="removePhoto(i)"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer border-top-0 p-3">
          <button type="button" class="btn btn-success w-100 py-2 fw-semibold" @click="submit">
            Створити мітку
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-modal-md {
  max-width: 600px;
  height: 90vh;
}

.scrollable-content {
  max-height: 250px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.photo-thumb {
  width: 100px;
  height: 100px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background-color: #f1f1f1;
}

.btn-close-white {
  filter: invert(1);
}

textarea {
  resize: vertical;
}
</style>
