<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { createTrashMark } from "../../services/trashMarkService";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";
import Map from "../Map/Map.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "create"]);
const store = useStore();
const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);

const markerLng = ref(0);
const markerLat = ref(0);
const description = ref("");
const photoFiles = ref<File[]>([]);
const photoPreviews = ref<string[]>([]);

const descriptionBlock = ref<HTMLElement | null>(null);

const removePhoto = (index: number) => {
  photoFiles.value.splice(index, 1);
  photoPreviews.value.splice(index, 1);
};

const getUserLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Геолокація не підтримується");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      markerLat.value = pos.coords.latitude;
      markerLng.value = pos.coords.longitude;
    },
    () => {
      toast.error("Не вдалося визначити місцезнаходження");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};


const onMarkerMoved = ({ lng, lat }: { lng: number; lat: number }) => {
  markerLng.value = lng;
  markerLat.value = lat;
};

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;

  const files = Array.from(input.files);

  if (photoFiles.value.length + files.length > 5) {
    toast.warning("Максимум 5 фото");
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        photoFiles.value.push(file);
        photoPreviews.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
};

const submit = async () => {
  if (!description.value.trim()) {
    toast.error("Будь ласка, додайте опис");
    return;
  }

  if (photoPreviews.value.length === 0) {
    toast.error("Додайте хоча б одне фото");
    return;
  }

  if (!isAuthenticated.value) {
    toast.error("Створення мітки доступне лише авторизованим користувачам");
    return;
  }

  try {
    const newMark = await createTrashMark({
      description: description.value.trim(),
      location: {
        type: "Point",
        coordinates: [markerLng.value, markerLat.value],
      },
      photos: photoPreviews.value,
      status: "not collected",
    });

    toast.success("Мітку створено успішно!");
    emit("create", newMark);
    close();
  } catch (err) {
    toast.error("Помилка при створенні мітки");
  }
};

const close = () => {
  emit("close");
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      getUserLocation();
      description.value = "";
      photoFiles.value = [];
      photoPreviews.value = [];

      nextTick(() => {
        descriptionBlock.value?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }
);
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
    <div
      class="modal-dialog modal-dialog-centered custom-modal-md"
      role="document"
    >
      <div class="modal-content shadow-lg rounded-4">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title">Створи нову позначку</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Закрити"
            @click="close"
          ></button>
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
                  <img
                    :src="src"
                    class="w-100 h-100 object-fit-cover rounded"
                    alt="Фото"
                  />
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
          <button
            type="button"
            class="btn btn-success w-100 py-2 fw-semibold"
            @click="submit"
          >
            Створити мітку
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./AddTrashMarkModal.css"></style>
