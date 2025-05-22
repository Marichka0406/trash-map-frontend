<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

import trashImage from '../../assets/trash1.png';

const props = defineProps<{
  isOpen: boolean;
  mark: {
    id: number;
    location: {
      coordinates: [number, number];
    };
    description: string;
    amount: string;
    status: string;
    userId: number;
    photoUrl: string;
    user: {
      id: number;
      name: string;
      avatar: string;
    };
  } | null;
}>();

const emits = defineEmits(['close']);
const close = () => emits('close');
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-button" @click="close" aria-label="Close">&times;</button>
      
      <div v-if="mark" class="modal-body">
        <!-- Фото сміття -->
        <img :src="trashImage" alt="Trash photo" class="info-image" />

        <!-- Інформація про користувача -->
        <div class="info-box user-info">
          <img :src="mark.user.avatar" alt="User Avatar" class="user-avatar" />
          <div>
            <strong>{{ mark.user.name }}</strong>
            <div class="reporter-label">Reporter</div>
          </div>
        </div>

        <!-- Кількість сміття -->
        <div class="info-box">
          <strong>Amount of trash: </strong>
          <span v-if="mark.amount === 'little'">
            <i class="fas fa-trash" style="color: green;"></i> Little
          </span>
          <span v-else-if="mark.amount === 'medium'">
            <i class="fas fa-trash" style="color: orange;"></i> Medium
          </span>
          <span v-else-if="mark.amount === 'many'">
            <i class="fas fa-trash" style="color: red;"></i> Many
          </span>
        </div>

        <!-- Статус збору -->
        <div class="info-box">
          <strong>Status: </strong>
          <span v-if="mark.status === 'collected'">
            <i class="fas fa-check-circle" style="color: green;"></i> Collected
          </span>
          <span v-else>
            <i class="fas fa-times-circle" style="color: red;"></i> Not Collected
          </span>
        </div>

        <!-- Опис -->
        <div class="info-box">
          <strong>Description:</strong>
          <p>{{ mark.description }}</p>
        </div>

        <!-- Локація -->
        <div class="info-box">
          <strong>Location:</strong>
          <p>Latitude: {{ mark.location.coordinates[1] }}, Longitude: {{ mark.location.coordinates[0] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 500px;
  max-height: 100vh; 
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  right: 5px;
  z-index: 100;
  background: transparent;
  border: none;
  font-size: 40px;
  color: #28754e;
  cursor: pointer;
}

.close-button:hover {
  color: #e53935;
}

.modal-body {
  padding: 60px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  max-height: calc(80vh - 50px);
  scrollbar-width: none;       
  -ms-overflow-style: none;     
}

.modal-body::-webkit-scrollbar {
  display: none;               
}

.info-box {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
}

.info-box strong {
  color: #00796b;
}

.info-box p {
  margin: 5px 0 0;
}

.info-image {
  width: 100%;
  height: auto;
  max-height: 235px; 
  object-fit: cover;
  border-radius: 6px 6px 0 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.reporter-label {
  font-size: 12px;
  color: #6c757d;
}
</style>
