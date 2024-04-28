<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  lastAmount: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const { amount } = toRefs(props);
const trendingUp = computed<boolean>(() => props.amount >= props.lastAmount);
const icon = computed<string>(() =>
  trendingUp.value
    ? 'i-heroicons-arrow-trending-up'
    : 'i-heroicons-arrow-trending-down',
);
const { currency } = useCurrency(amount);

const percentageTrend = computed<string>(() => {
  if (props.amount === 0 || props.lastAmount === 0) {
    return '∞%';
  }

  const bigger = Math.max(props.amount, props.lastAmount);
  const lower = Math.min(props.amount, props.lastAmount);

  const ratio = ((bigger - lower) / lower) * 100;

  return `${Math.ceil(ratio)}%`;
});
</script>

<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton v-if="loading" class="h-8 w-full" />
      <div v-else>{{ currency }}</div>
    </div>

    <div>
      <USkeleton v-if="loading" class="h-6 w-full" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="{ green: trendingUp, red: !trendingUp }"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
