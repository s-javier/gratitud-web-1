import { map } from 'nanostores'

export const $modalAlert = map<{
  is: boolean
  type: 'success' | 'warning' | 'error' | 'info' | 'question'
  title: string
  message: string
}>({
  is: false,
  type: 'info',
  title: '',
  message: '',
})
