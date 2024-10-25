import type { ActionAPIContext } from 'astro:actions'

export const setUserTokenCookie = (context: ActionAPIContext, token: string) => {
  context.cookies.set('token', token, {
    domain: context.request.headers.get('host')?.startsWith('localhost')
      ? 'localhost'
      : import.meta.env.PUBLIC_BASE_URL.split('https://')[1],
    path: '/',
    /* ↓ Prevenir el acceso a las cookies a través de JS. Esto ayuda a mitigar los ataques de XSS donde un atacante podría intentar robar cookies */
    httpOnly: true,
    /* ↓ Cookie solo se envíe a través de conexiones seguras (HTTPS) */
    secure: context.request.headers.get('host')?.startsWith('localhost') ? false : true,
    /* ↓ Controlar el envío de cookies con solicitudes entre sitios. Esto ayuda a proteger contra ataques de CSRF */
    // sameSite: request.headers.get('host')?.startsWith('localhost') ? false : 'strict',
    sameSite: 'strict',
    /* ↓ Segundos. 5 días - 10 minutos */
    maxAge: Number(import.meta.env.SESSION_DAYS) * 24 * 60 * 60 - 10 * 60,
  })
}

export const deleteUserTokenCookie = (context: ActionAPIContext) => {
  context.cookies.set('token', '', {
    domain: context.request.headers.get('host')?.startsWith('localhost')
      ? 'localhost'
      : import.meta.env.PUBLIC_BASE_URL.split('https://')[1],
    path: '/',
    httpOnly: true,
    secure: context.request.headers.get('host')?.startsWith('localhost') ? false : true,
    sameSite: 'strict',
    expires: new Date(0),
  })
}
