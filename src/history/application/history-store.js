import { ref } from 'vue';
import { defineStore } from 'pinia';
import { HistoryEntity } from '../domain/model/history-entity.js';
import { HistoryApi } from '../infrastructure/history-api.js';

const historyApi = new HistoryApi();

export const useHistoryStore = defineStore('history', () => {
  const events = ref([]);
  const selectedEvent = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const filters = ref({
    search: '',
    severity: '',
  });

  async function fetchEvents() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await historyApi.getEvents();
      const dataList = Array.isArray(response.data) ? response.data : response.data?.data || [];

      events.value = dataList.map((resource) => HistoryEntity.fromResource(resource));
      if (events.value.length > 0 && !selectedEvent.value) {
        selectedEvent.value = events.value[0];
      }
    } catch (err) {
      error.value = err;
      console.warn('Servidor API no disponible. Cargando eventos locales...');
    } finally {
      isLoading.value = false;
    }
  }

  async function createEvent(eventData) {
    isLoading.value = true;
    try {
      const response = await historyApi.createData(eventData);
      const newEntity = HistoryEntity.fromResource(response.data || payload);
      events.value.unshift(newEntity);
      selectedEvent.value = newEntity;
    } catch (err) {
      error.value = err;
      console.warn('API no disponible para POST. Insertando evento de forma local en la vista...');
      const fallbackEntity = HistoryEntity.fromResource({
        ...eventData,
        id: Date.now().toString(),
      });
      events.value.unshift(fallbackEntity);
      selectedEvent.value = fallbackEntity;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteEvent(id) {
    isLoading.value = true;
    try {
      await historyApi.deleteData(id);
      events.value = events.value.filter((e) => e.id !== id);
      if (selectedEvent.value?.id === id) {
        selectedEvent.value = events.value[0] || null;
      }
    } catch (err) {
      error.value = err;
      console.warn('API no disponible para DELETE. Eliminando de forma local...');
      events.value = events.value.filter((e) => e.id !== id);
      if (selectedEvent.value?.id === id) {
        selectedEvent.value = events.value[0] || null;
      }
    } finally {
      isLoading.value = false;
    }
  }

  function selectEvent(event) {
    selectedEvent.value = event;
  }

  function updateFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters };
  }

  return {
    events,
    selectedEvent,
    isLoading,
    error,
    filters,
    fetchEvents,
    createEvent,
    deleteEvent,
    selectEvent,
    updateFilters,
  };
});

export default useHistoryStore;
