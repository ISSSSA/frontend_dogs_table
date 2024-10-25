<template>
  <v-container>
    <v-data-table
      :items="dogs"
      :loading="loading"
      class="elevation-1"
    >
      <template #loading>
        <v-row align="center" justify="center">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>
    </v-data-table>

    <v-btn color="primary" @click="openAddDialog">Добавить собаку</v-btn>

    <v-dialog v-model="dialogVisible" max-width="600px">
      <template #title>
        <span>{{ isEditing ? 'Редактировать собаку' : 'Добавить собаку' }}</span>
      </template>
      <v-card>
        <v-card-text>
          <v-text-field v-model="form.breed" label="Порода" />
          <v-text-field v-model="form.name" label="Кличка" />
          <v-text-field v-model="form.owner" label="Хозяин" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="isEditing ? updateDog() : addDog()">
            {{ isEditing ? 'Сохранить' : 'Добавить' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col v-for="dog in dogs" :key="dog.id" cols="12" sm="4">
        <v-card>
          <v-card-title>{{ dog.name }}</v-card-title>
          <v-card-subtitle>{{ dog.breed }} - {{ dog.owner }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="green" @click="openEditDialog(dog)">Изменить</v-btn>
            <v-btn color="red" @click="deleteDog(dog.id)">Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useDogStore } from '@/stores/dogStore';
import { onMounted, ref, computed } from 'vue';

const dogStore = useDogStore();

// Загружаем данные при монтировании компонента
onMounted(() => {
  dogStore.fetchDogs();
});

const dogs = computed(() => dogStore.dogs);
const loading = computed(() => dogStore.loading);

// Управление диалогом
const dialogVisible = ref(false);
const isEditing = ref(false);
const form = ref({ breed: '', name: '', owner: '' });

const openAddDialog = () => {
  form.value = { breed: '', name: '', owner: '' };
  isEditing.value = false;
  dialogVisible.value = true;
};

const openEditDialog = (dog) => {
  form.value = { ...dog };
  isEditing.value = true;
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const addDog = async () => {
  await dogStore.addDog(form.value);
  closeDialog();
};

const updateDog = async () => {
  await dogStore.updateDog(form.value);
  closeDialog();
};

const deleteDog = async (id) => {
  await dogStore.deleteDog(id);
};
</script>

<style scoped>
.v-data-table {
  width: 100%;
}
</style>
