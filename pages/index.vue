<script setup lang="ts">
import { transactionViewOptions } from '~/utils/common.constants';
import composables from '~/composables';
import TrendView from '~/components/TrendView.vue';
import type { Period } from '~/utils/common.interfaces';

/* -- Fetch data for finance-tracker */
const user = useSupabaseUser();
const selectedView = ref<Period>(
  user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1],
);
const isOpen = ref<boolean>(false);
const { current, previous } = composables.useSelectedTimePeriod(selectedView);

const {
  pending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { byDate },
  },
} = composables.useFetchTransactions(current);
await refresh();

const {
  refresh: refreshPrevious,
  transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal,
  },
} = composables.useFetchTransactions(previous);
await refreshPrevious();
/* /- Fetch data for finance-tracker */
</script>

<template>
  <main>
    <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
        <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
      </div>
    </section>

    <section
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
    >
      <TrendView
        color="green"
        title="Income"
        :amount="incomeTotal"
        :last-amount="prevIncomeTotal"
        :loading="pending"
      />
      <TrendView
        color="red"
        title="Expense"
        :amount="expenseTotal"
        :last-amount="prevExpenseTotal"
        :loading="pending"
      />
      <TrendView
        color="green"
        title="Investments"
        :amount="4000"
        :last-amount="3000"
        :loading="pending"
      />
      <TrendView
        color="red"
        title="Saving"
        :amount="4000"
        :last-amount="4100"
        :loading="pending"
      />
    </section>

    <section class="flex justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-gray-500 dark:text-gray-400">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses
          this period
        </div>
      </div>
      <div>
        <TransactionModal v-model="isOpen" @saved="refresh()" />
        <UButton
          icon="i-heroicons-plus-circle"
          color="white"
          variant="solid"
          label="Add"
          @click="isOpen = true"
        />
      </div>
    </section>

    <section v-if="!pending">
      <div
        v-for="(transactionsOnDay, date) in byDate"
        :key="date"
        class="mb-10"
      >
        <DailyTransactionSummary
          :date="date"
          :transactions="transactionsOnDay"
        />
        <TransactionView
          v-for="transaction in transactionsOnDay"
          :key="transaction.id"
          :transaction="transaction"
          @deleted="refresh()"
          @edited="refresh()"
        />
      </div>
    </section>
    <section v-else>
      <USkeleton v-for="i in 4" :key="i" class="h-8 w-full mb-2" />
    </section>
  </main>
</template>
