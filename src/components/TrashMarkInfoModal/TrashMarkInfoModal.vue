<script setup lang="ts">
import { ref, watch } from "vue";
import Map from "../Map/Map.vue";
import { getTrashMarkById } from "../../services/trashMarkService";
import { getAddressFromCoords } from "../../services/geocodingService";
import { toast } from "vue3-toastify";

const props = defineProps<{ visible: boolean; markId: string }>();
const emit = defineEmits(["close", "updateStatus", "openHistory"]);

const loading = ref(true);
const markData = ref<any>(null);
const fullscreenImage = ref<string | null>(null);
const address = ref<string | null>(null);

const close = () => emit("close");
const openHistory = () => emit("openHistory");
const updateStatus = () => emit("updateStatus");
const closeImage = () => (fullscreenImage.value = null);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const translateStatus = (status: string) => {
  switch (status) {
    case "collected":
      return "Зібрано";
    case "not collected":
      return "Не зібрано";
    default:
      return "Невідомо";
  }
};

const fetchMarkData = async () => {
  try {
    loading.value = true;
    const data = await getTrashMarkById(props.markId);
    const user = data.updatedBy;

    markData.value = {
      description: data.description,
      photos: data.photos ?? [],
      status: data.status,
      history: data.trashMarkHistory,
      editedAt: data.updatedAt,
      editedBy: user?.fullName ?? "Невідомо",
      editedByPhoto: user?.avatar ?? null,
      coordinates: data.location.coordinates,
    };

    const result = await getAddressFromCoords(
      markData.value.coordinates[1],
      markData.value.coordinates[0]
    );
    address.value = result;
  } catch (err) {
    toast.error("Не вдалося завантажити мітку");
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.visible && props.markId,
  (active) => {
    if (active) fetchMarkData();
  },
  { immediate: true }
);
</script>

<template>
  <div class="modal-wrapper">
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
          <div
            class="modal-header border-bottom-0 flex-column align-items-start gap-1"
          >
            <h6 class="text-muted mb-0">Адреса</h6>
            <h5 class="modal-title fw-bold text-success">
              {{ address || "Позначка" }}
            </h5>
            <button
              type="button"
              class="btn-close position-absolute end-0 top-0 mt-2 me-2"
              aria-label="Закрити"
              @click="close"
            ></button>
          </div>

          <div v-if="loading" class="p-5 text-center">
            <div
              class="spinner-border text-success"
              role="status"
              style="width: 3rem; height: 3rem"
            >
              <span class="visually-hidden">Завантаження...</span>
            </div>
          </div>

          <div v-else class="modal-body py-0">
            <div class="mb-4">
              <Map
                :center="markData.coordinates"
                :zoom="16"
                :readOnly="true"
                :editableMarker="false"
                :height="'200px'"
                :showControls="false"
                :markers="[
                  {
                    lng: markData.coordinates[0],
                    lat: markData.coordinates[1],
                  },
                ]"
                class="rounded-3 border"
              />
            </div>

            <div class="scrollable-content px-2">
              <div
                class="d-flex justify-content-between align-items-start mb-3"
              >
                <div>
                  <div class="text-muted small mb-1">
                    Востаннє редаговано користувачем:
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <img
                      :src="markData.editedByPhoto"
                      width="32"
                      class="rounded-circle"
                    />
                    <div>
                      <div class="fw-semibold">{{ markData.editedBy }}</div>
                      <small class="text-muted">{{
                        formatDate(markData.editedAt)
                      }}</small>
                    </div>
                  </div>
                </div>
                <button
                  class="btn btn-sm btn-outline-secondary mt-1"
                  @click="openHistory"
                  title="Історія змін"
                >
                  <i class="fas fa-clock-rotate-left"></i>
                </button>
              </div>

              <div class="d-flex flex-wrap gap-2 mb-3">
                <img
                  v-for="(src, i) in markData.photos"
                  :key="i"
                  :src="src"
                  alt="Фото"
                  class="rounded object-fit-cover"
                  style="width: 100px; height: 100px; cursor: pointer"
                  @click="fullscreenImage = src"
                />
              </div>

              <div class="mb-2 p-2 border rounded bg-light">
                <strong>Опис:</strong><br />
                {{ markData.description }}
              </div>

              <div class="mb-3 p-2 border rounded bg-light">
                <strong>Статус сміття:</strong><br />
                {{ translateStatus(markData.status) }}
              </div>
            </div>
          </div>

          <div class="modal-footer border-top-0 p-3">
            <button
              class="btn btn-success w-100 fw-semibold py-2"
              @click="updateStatus"
            >
              Оновити статус позначки
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Повноекранне фото -->
    <Teleport to="body">
      <div
        v-if="fullscreenImage"
        class="fullscreen-backdrop"
        @click="closeImage"
      >
        <img :src="fullscreenImage" class="fullscreen-image" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-wrapper {
  position: relative;
  z-index: 1050;
}
.custom-modal-md {
  max-width: 600px;
  height: 90vh;
}
.scrollable-content {
  max-height: 200px;
  overflow-y: auto;
  scroll-behavior: smooth;
}
.fullscreen-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
  cursor: zoom-out;
}
.fullscreen-image {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
}
</style>
