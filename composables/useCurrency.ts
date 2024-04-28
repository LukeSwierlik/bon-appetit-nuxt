import type { Ref } from 'vue';

export const useCurrency = (amount: Ref<number> | number) => {
  const currency = computed<string>(() => {
    const format = isRef(amount) ? amount.value : amount;

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'EUR',
    }).format(format);
  });

  return {
    currency,
  };
};
