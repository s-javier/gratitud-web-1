import { atom } from 'nanostores'

export const $permissions = atom<{ id: string; path: string }[]>([])
