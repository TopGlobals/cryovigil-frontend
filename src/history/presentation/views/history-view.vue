<template>
  <div class="history-context-container">
    <div class="main-content-layout">
      <div class="action-bar-section flex justify-content-end mb-3">
        <pv-button
          :label="$t('history.add_event')"
          icon="pi pi-plus"
          class="p-button-success"
          @click="isCreateModalOpen = true"
        />
      </div>

      <HistoryKpiSummary />

      <HistoryFilterBar @filter-change="handleFilterChange" />

      <div v-if="store.isLoading && filteredEvents.length === 0" class="loading-state">
        {{ $t('history.loading') }}
      </div>

      <HistoryList
        v-else
        :events="filteredEvents"
        :selected-event-id="store.selectedEvent?.id"
        @select-event="store.selectEvent"
      />
    </div>

    <div v-if="store.selectedEvent" class="details-wrapper">
      <HistoryDetailsPanel :event="store.selectedEvent" @close="store.selectEvent(null)" />
      <div class="delete-action-container p-3">
        <pv-button
          :label="$t('history.delete_event')"
          icon="pi pi-trash"
          class="p-button-danger w-full"
          @click="handleDeleteEvent(store.selectedEvent.id)"
        />
      </div>
    </div>

    <pv-dialog
      v-model:visible="isCreateModalOpen"
      :header="$t('history.create_dialog_title')"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="p-fluid flex flex-column gap-3 mt-2">
        <div class="field">
          <label for="titleKey" class="font-bold">{{ $t('history.fields.title_key') }}</label>
          <pv-input-text
            id="titleKey"
            v-model="newEvent.titleKey"
            placeholder="history.events.event1.title"
          />
        </div>

        <div class="field">
          <label for="type" class="font-bold">{{ $t('history.fields.type') }}</label>
          <pv-input-text id="type" v-model="newEvent.type" placeholder="User Action" />
        </div>

        <div class="field">
          <label for="severity" class="font-bold">{{ $t('history.fields.severity') }}</label>
          <pv-input-text id="severity" v-model="newEvent.severity" placeholder="Info" />
        </div>

        <div class="field">
          <label for="location" class="font-bold">{{ $t('history.fields.location') }}</label>
          <pv-input-text
            id="location"
            v-model="newEvent.location"
            placeholder="Lab A - Biochemistry Wing"
          />
        </div>

        <div class="field">
          <label for="sensor" class="font-bold">{{ $t('history.fields.sensor') }}</label>
          <pv-input-text id="sensor" v-model="newEvent.sensor" placeholder="TH-04 (Cabinet C3)" />
        </div>

        <div class="field">
          <label for="messageKey" class="font-bold">{{ $t('history.fields.message_key') }}</label>
          <pv-input-text
            id="messageKey"
            v-model="newEvent.messageKey"
            placeholder="history.events.event1.message"
          />
        </div>
      </div>

      <template #footer>
        <pv-button
          :label="$t('history.buttons.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeModal"
        />
        <pv-button
          :label="$t('history.buttons.save')"
          icon="pi pi-check"
          class="p-button-primary"
          :loading="store.isLoading"
          @click="saveNewEvent"
        />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useHistoryStore } from '../../application/history-store.js';
import HistoryKpiSummary from '../components/history-kpi-summary.vue';
import HistoryFilterBar from '../components/history-filter-bar.vue';
import HistoryList from '../components/history-list.vue';
import HistoryDetailsPanel from '../components/history-details-panel.vue';

const store = useHistoryStore();
const { t, te } = useI18n();

const isCreateModalOpen = ref(false);

const initialFormState = {
  titleKey: 'history.events.event1.title',
  type: 'User Action',
  severity: 'Info',
  location: 'Lab A - Biochemistry Wing',
  sensor: 'MANUAL-01',
  messageKey: 'history.events.event1.message',
  isResolved: true,
  actionsTakenKeys: [],
};

const newEvent = ref({ ...initialFormState });

onMounted(() => {
  store.fetchEvents();
});

const handleFilterChange = (newFilters) => {
  store.updateFilters(newFilters);
};

const closeModal = () => {
  isCreateModalOpen.value = false;
  newEvent.value = { ...initialFormState };
};

const saveNewEvent = async () => {
  const payload = {
    ...newEvent.value,
    timestamp: new Date().toISOString(),
  };
  await store.createEvent(payload);
  closeModal();
};

const handleDeleteEvent = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este registro del historial?')) {
    store.deleteEvent(id);
  }
};

const translateSafely = (key) => {
  if (!key) return '';
  return te(key) ? t(key) : key;
};

const filteredEvents = computed(() => {
  return store.events.filter((event) => {
    const translatedTitle = translateSafely(event.titleKey).toLowerCase();
    const translatedMessage = translateSafely(event.messageKey).toLowerCase();
    const searchString = store.filters.search ? store.filters.search.toLowerCase() : '';

    const matchesSearch =
      !searchString ||
      translatedTitle.includes(searchString) ||
      translatedMessage.includes(searchString);

    const matchesSeverity =
      !store.filters.severity ||
      (event.severity && event.severity.toLowerCase() === store.filters.severity.toLowerCase());

    return matchesSearch && matchesSeverity;
  });
});
</script>

<style scoped>
.history-context-container {
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
}
.main-content-layout {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
.action-bar-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.loading-state {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}
.details-wrapper {
  display: flex;
  flex-direction: column;
}
.delete-action-container {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
}
</style>
