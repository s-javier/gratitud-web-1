import { atom } from 'nanostores'

export const $roles = atom<{ id: string; title: string }[]>([])

export const $rolePermission = atom<{ roleId: string; permissionId: string }[]>([])
