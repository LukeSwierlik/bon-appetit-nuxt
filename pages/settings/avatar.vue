<script setup lang="ts">
import { useAppToast } from '~/composables/useAppToast';
import { useAvatarUrl } from '~/composables/useAvatarUrl';
import type { UInput } from '#components';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast();
const { url } = useAvatarUrl();

const uploading = ref<boolean>(false);
const fileInput = ref<InstanceType<typeof UInput> | null>(); // Reference to an input with ref="fileInput" attribute

const saveAvatar = async () => {
  // 1. Get the uploaded file
  //    a) If no file uploaded, show toast error
  // 2. Generate the new filename
  const file = fileInput.value?.input?.files?.[0] || undefined;

  if (!file) {
    toastError({ title: 'Select a file to upload first' });
    return;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  try {
    uploading.value = true;
    // 1. Grab the current avatar URL
    const currentAvatarUrl = user.value?.user_metadata?.avatar_url;
    // 2. Upload the image to avatars bucket
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // 3. Update the user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });
    // 4. (OPTIONALLY) remove the old avatar file
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl]);
      if (error) throw error;
    }

    console.log('fileInput', fileInput.value);
    // 5. Reset the file input
    // fileInput.value = {
    //   ...file,
    //   input: {
    //     value: null,
    //   },
    // };

    toastSuccess({
      title: 'Avatar uploaded',
    });
  } catch (error: any) {
    toastError({
      title: 'Error uploading avatar',
      description: error.message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar v-if="url" :src="url" size="3xl" />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput ref="fileInput" type="file" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>
