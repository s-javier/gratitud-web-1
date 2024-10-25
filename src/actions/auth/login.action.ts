import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { eq } from 'drizzle-orm'
import { customAlphabet } from 'nanoid'
// @ts-ignore
import { createTransport } from 'nodemailer'

import { Api, Error } from '~/enums'
import db from '~/db'
import { personTable, sessionTable } from '~/db/schema'
import { dayjs, handleErrorFromServer } from '~/utils'

export const login = defineAction({
  accept: 'json',
  input: z.string().min(1, 'El email es requerido.').email('El email es inválido.'),
  handler: async (input: any) => {
    let user
    try {
      const query = await db
        .select({
          id: personTable.id,
          name: personTable.name,
          isActive: personTable.isActive,
        })
        .from(personTable)
        .where(eq(personTable.email, input))
      if (query.length === 0) {
        if (import.meta.env.DEV) {
          console.error('Usuario no encontrado.')
        }
        return { error: handleErrorFromServer(Error.USER_NOT_FOUND, Api.AUTH_SIGN_IN) }
      }
      user = query[0]
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Consultar usuario.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    if (user.isActive === false) {
      if (import.meta.env.DEV) {
        console.error('Usuario no activo.')
      }
      return { error: handleErrorFromServer(Error.USER_IS_DISABLED, Api.AUTH_SIGN_IN) }
    }
    /* ▼ Crear sesión */
    const alphabet = '0123456789'
    const code = customAlphabet(alphabet, 6)()
    const expiresAt = dayjs
      .utc()
      .add(Number(import.meta.env.SESSION_DAYS), 'day')
      .toDate()
    const codeExpiresAt = dayjs.utc().add(5, 'minute').toDate()
    try {
      await db.insert(sessionTable).values({
        personId: user.id,
        expiresAt,
        code,
        codeExpiresAt,
        codeIsActive: true,
      })
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Crear sesión.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    /* ▲ Crear sesión */
    /* ▼ Enviar email */
    const transporter = createTransport({
      host: import.meta.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
      debug: true,
    })
    try {
      await transporter.sendMail({
        from: '"Condimento" <noresponder@condimento.cl>',
        to: input /* Email del usuario */,
        subject: 'Ingreso',
        html: `
          <div style="background-color:rgb(207,208,209);padding-top:30px;padding-bottom:30px">
            <div style="padding:30px;font-size:14px;font-family:Lato,Helvetica,Arial,sans-serif;color:rgb(55,65,81);line-height:1.5em;width:98%;max-width:500px;border-radius:16px;margin:10px auto 0;background-color:white">
              <div style="text-align:center;">
                <img src="https://condimento.cl/images/imagotipo.png" style="width:200px;margin-bottom:30px" alt="Logo de Condimento" />
              </div>
              <p style="margin-bottom: 16px">Hola, ${user.name}:</p>
              <p style="margin-bottom: 16px">Bienvenido/a a Condimento. Por favor, utiliza este código para ingresar:</p>
              <p style="margin-bottom: 30px; text-align: center;">${code}</p>
              <p>Que tengas un buen día.</p>
            </div>
          </div>
        `,
      })
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en enviar email.')
      }
      return { error: handleErrorFromServer(Error.EMAIL_WITH_CODE, Api.AUTH_SIGN_IN) }
    }
    /* ▲ Enviar email */
  },
})
