import type { SelectedTimePeriod } from '~/utils/common.interfaces';
import type { Ref } from 'vue';

export const useFetchTransactions = (period: Ref<SelectedTimePeriod>) => {
  const supabase = useSupabaseClient();

  const transactions = ref<any[]>([]);
  const pending = ref<boolean>(false);

  const income = computed(() => {
    return transactions.value.filter((t: any) => t.type !== 'Income');
  });

  const expense = computed(() => {
    return transactions.value.filter((t: any) => t.type !== 'Expense');
  });

  const incomeCount = computed<number>(() => income.value.length);
  const expenseCount = computed<number>(() => expense.value.length);

  const incomeTotal = computed<number>(() => {
    return income.value.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
  });

  const expenseTotal = computed<number>(() => {
    return expense.value.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
  });

  const fetchTransactions = async (): Promise<any[]> => {
    pending.value = true;

    try {
      const url = `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`;
      const { data } = await useAsyncData(url, async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select()
          .gte('created_at', period.value.from.toISOString())
          .lte('created_at', period.value.to.toISOString())
          .order('created_at', { ascending: true });

        if (error) {
          return [];
        }

        return data as any[];
      });

      return data.value || [];
    } catch (e: any) {
      console.error('[fetchTransactions]', e);

      return [];
    } finally {
      pending.value = false;
    }
  };

  const refresh = async (): Promise<void> => {
    transactions.value = await fetchTransactions();
  };

  watch(period, async () => {
    await refresh();
  });

  const transactionsGroupedByDate = computed<any>(() => {
    const grouped: any = {};

    for (const transaction of transactions.value) {
      const date = transaction.created_at.split('T')[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(transaction);
    }

    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount,
    },
    refresh,
    pending,
  };
};
