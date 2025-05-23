<script lang="ts" setup>
import { onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'

const props = defineProps<{
  id: string
  lng: number
  lat: number
  color?: string
  map?: mapboxgl.Map
}>()

const emit = defineEmits<{
  (e: 'showInfo', id: string): void
}>()

onMounted(() => {
  if (!props.map) return

  const marker = new mapboxgl.Marker({
    color: props.color ?? '#f44336',
  })
    .setLngLat([props.lng, props.lat])
    .addTo(props.map)

  marker.getElement().addEventListener('click', () => {
    emit('showInfo', props.id)
  })
})
</script>

<template>
  <!-- Не рендеримо нічого в DOM, усе робиться через Mapbox -->
</template>
