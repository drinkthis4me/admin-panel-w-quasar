import { useQuasar } from 'quasar'
import { unref, Ref } from 'vue'

export const useNotify = () => {
  const $q = useQuasar()

  type NotifyType = 'negative' | 'positive'
  const triggerNotify = (
    notifyType: NotifyType,
    message: string | Ref<string>
  ) => {
    const msgUnref = unref(message)
    $q.notify({
      type: notifyType,
      message: msgUnref,
      actions: [{ icon: 'cancel', color: 'white' }],
    })
  }

  return {
    triggerNotify,
  }
}
