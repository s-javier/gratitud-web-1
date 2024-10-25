import { atom } from 'nanostores'

export const $roles = atom<{ id: string; title: string }[]>([])
