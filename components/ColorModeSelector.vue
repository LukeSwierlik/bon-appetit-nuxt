<script setup lang="ts">
import { computed } from '#imports';
import type { Modes } from '~/utils/common.interfaces';
import { modes, nextModeIcons } from '~/utils/common.constants';

// Composables
const colorMode = useColorMode();

// Refs
const showNextModelLabel = ref<boolean>(false);

// Computed
const nextMode = computed<Modes>(() => {
  const currentModeIndex = modes.indexOf(colorMode.preference);
  let nextModeIndex = null;

  if (currentModeIndex + 1 === modes.length) {
    nextModeIndex = 0;
  } else {
    nextModeIndex = currentModeIndex + 1;
  }

  return modes[nextModeIndex] as Modes;
});

const nextModeIcon = computed<string>(() => nextModeIcons[nextMode.value]);

// Methods
const toggleMode = (): void => {
  colorMode.preference = nextMode.value;
};
</script>

<template>
  <div class="flex space-x-2 items-center">
    <div v-if="showNextModelLabel" class="text-gray-500 text-xs">
      Change to {{ nextMode }}
    </div>

    <button
      class="hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 text-gray-500 text-4xl md:text-base"
      @click="toggleMode"
      @mouseenter="showNextModelLabel = true"
      @mouseleave="showNextModelLabel = false"
    >
      {{ nextModeIcon }}
    </button>
  </div>
</template>
