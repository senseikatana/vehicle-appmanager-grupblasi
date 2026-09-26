// Feedback unificado de forms: un solo toast en éxito, uno en error.
export function useFormFeedback() {
  const toast = useToast()

  function notifySuccess(message: string) {
    toast.add({ title: message, color: 'success', icon: 'i-lucide-circle-check' })
  }

  function notifyError(message: string) {
    toast.add({ title: message, color: 'error', icon: 'i-lucide-circle-alert' })
  }

  // Extrae el mensaje real de un error de la API de Nuxt.
  function errorMessage(e: unknown, fallback: string) {
    if (e && typeof e === 'object' && 'data' in e) {
      const data = (e as { data?: { message?: string } }).data
      if (data?.message) return data.message
    }
    return e instanceof Error && e.message ? e.message : fallback
  }

  return { notifySuccess, notifyError, errorMessage }
}
