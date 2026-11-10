<template>
  <div class="history-list-wrapper">
    <div v-for="(group, date) in groupedEvents" :key="date" class="date-group">
      <div class="date-header">{{ translateDateLabel(date) }}</div>
      <div class="cards-stack">
        <HistoryItemCard
          v-for="event in group"
          :key="event.id"
          :event="event"
          :is-active="String(selectedEventId) === String(event.id)"
          @click="$emit('select-event', event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import HistoryItemCard from './history-item-card.vue';

const props = defineProps({
  events: { type: Array, required: true },
  selectedEventId: { type: [String, Number], default: null },
});

defineEmits(['select-event']);

const { t } = useI18n();

const groupedEvents = computed(() => {
  return props.events.reduce((groups, event) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const rawDate = event.timestamp instanceof Date ? event.timestamp : new Date(event.timestamp);
    const eventDate = isNaN(rawDate.getTime()) ? new Date().toDateString() : rawDate.toDateString();

    let dayLabel = eventDate;
    if (eventDate === today) dayLabel = 'TODAY';
    else if (eventDate === yesterday) dayLabel = 'YESTERDAY';

    if (!groups[dayLabel]) groups[dayLabel] = [];
    groups[dayLabel].push(event);
    return groups;
  }, {});
});

const translateDateLabel = (label) => {
  if (label === 'TODAY') return t('history.todayLabel');
  if (label === 'YESTERDAY') return t('history.yesterdayLabel');
  return label;
};
</script>

<style scoped>
.date-group {
  margin-bottom: 24px;
}
.date-header {
  font-size: 0.8rem;
  font-weight: 700;
  color: #9ca3af;
  margin-bottom: 12px;
  text-transform: uppercase;
}
.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
