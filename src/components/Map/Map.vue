<script lang="ts" setup>
import { ref, onMounted, defineEmits, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'

interface MarkerData {
  lng: number
  lat: number
  draggable?: boolean
  color?: string
}

const props = defineProps<{
  center?: [number, number]
  zoom?: number
  markers?: MarkerData[]
  editableMarker?: boolean
  constrainRadiusMeters?: number
  height?: string
  showControls?: boolean
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'markerMoved', coords: { lng: number; lat: number }): void
  (e: 'mapReady', map: mapboxgl.Map): void
}>()

const mapRef = ref<HTMLDivElement | null>(null)
const mapInstance = ref<mapboxgl.Map | null>(null)
defineExpose({ mapInstance })

const editableMarkerRef = ref<mapboxgl.Marker | null>(null)
const initialPosition = ref<[number, number] | null>(null)

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const toRad = (deg: number) => (deg * Math.PI) / 180

const distanceMeters = (a: [number, number], b: [number, number]) => {
  const R = 6371000
  const dLat = toRad(b[1] - a[1])
  const dLng = toRad(b[0] - a[0])
  const lat1Rad = toRad(a[1])
  const lat2Rad = toRad(b[1])
  const aCalc =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc))
  return R * c
}

const initMap = () => {
  if (!mapRef.value) return

  const center = props.center || [30.5234, 50.4501]

  let bounds: mapboxgl.LngLatBoundsLike | undefined
  if (props.constrainRadiusMeters) {
    const metersToDegrees = (m: number) => m / 111320
    const offset = metersToDegrees(props.constrainRadiusMeters)
    bounds = [
      [center[0] - offset, center[1] - offset],
      [center[0] + offset, center[1] + offset],
    ]
  }

  const map = new mapboxgl.Map({
    container: mapRef.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center,
    zoom: props.zoom ?? 16,
    maxBounds: bounds,
  })

  if (props.constrainRadiusMeters) {
    map.boxZoom.disable()
    map.dragRotate.disable()
    map.keyboard.disable()
    map.touchZoomRotate.disable()

    map.on('moveend', () => {
      const bounds = map.getBounds()
      if (!bounds) return

      const mapCenter = map.getCenter()
      const corner = bounds.getNorthEast()

      const dist = distanceMeters(
        [mapCenter.lng, mapCenter.lat],
        [corner.lng, corner.lat]
      )

      if (dist > props.constrainRadiusMeters!) {
        map.zoomTo(map.getZoom() + 0.5, { duration: 0 })
      }
    })
  }

  if (!props.readOnly && props.showControls) {
    map.addControl(new mapboxgl.NavigationControl())
  }

  if (props.markers?.length) {
    props.markers.forEach(({ lng, lat, color, draggable }) => {
      new mapboxgl.Marker({ color, draggable }).setLngLat([lng, lat]).addTo(map)
    })
  }

  if (props.editableMarker && props.center) {
    initialPosition.value = props.center

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat(props.center)
      .addTo(map)

    marker.on('drag', () => {
      if (!initialPosition.value || !props.constrainRadiusMeters) return

      const pos = marker.getLngLat()
      const dist = distanceMeters([pos.lng, pos.lat], initialPosition.value)

      if (dist > props.constrainRadiusMeters) {
        marker.setLngLat(initialPosition.value)
      } else {
        emit('markerMoved', { lng: pos.lng, lat: pos.lat })
      }
    })

    editableMarkerRef.value = marker
  }

  map.on('load', () => {
    map.resize()
  })

  mapInstance.value = map
  emit('mapReady', map) 
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initMap()
    }, 100)
  })
})
</script>

<template>
  <div ref="mapRef" :style="{ width: '100%', height }" class="map-container" />
</template>

<style scoped>
.map-container {
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
