<script setup lang="ts">
import { z } from 'zod';
import { useAppToast } from '~/composables/useAppToast';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();
const pending = ref<boolean>(false);

interface SaveProfileDate {
  name?: string;
  data?: {
    full_name?: string;
  };
  email?: string;
}

const state = ref<SaveProfileDate>({
  name: user.value?.user_metadata?.full_name || '',
  email: user.value?.email,
});

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
});

const saveProfile = async () => {
  pending.value = true;

  try {
    const data: SaveProfileDate = {
      data: {
        full_name: state.value.name,
      },
    };

    if (state.value.email !== user?.value?.email) {
      data.email = state.value.email;
    }

    console.log(data);

    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;

    toastSuccess({
      title: 'Profile updated',
      description: 'Your profile has been updated',
    });
  } catch (error: any) {
    toastError({
      title: 'Error updating profile',
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveProfile">
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup
      class="mb-4"
      label="Email"
      name="email"
      help="You will receive a confirmation email on both the old and the new addresses if you modify the email address"
    >
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>
