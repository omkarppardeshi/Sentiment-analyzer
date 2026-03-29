/**
 * Toaster Component
 *
 * Renders all active toasts from the context
 */

'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastProvider,
  ToastViewport,
} from '@/components/ui/toast';
import { useToastContext } from '@/components/ui/use-toast';

function Toaster() {
  const { toasts } = useToastContext();

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export { Toaster };
