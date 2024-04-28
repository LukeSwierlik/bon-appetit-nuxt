interface ToastProps {
  title: string;
  description?: string;
}

export const useAppToast = () => {
  const toast = useToast();

  return {
    toastSuccess: ({ title, description }: ToastProps) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'green',
      });
    },
    toastError: ({ title, description }: ToastProps) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      });
    },
  };
};
