import { atom } from 'nanostores'

export const $organizations = atom<{ id: string; title: string }[]>([])
