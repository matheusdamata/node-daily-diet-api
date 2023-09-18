/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function userRoutes(app: FastifyInstance | any) {
  app.post('/', async (req, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
      name: z.string(),
    })

    const { username, name } = createUserBodySchema.parse(req.body)

    const userAlreadyExists = await knex('users')
      .where({
        username,
      })
      .first()

    if (userAlreadyExists) {
      return reply.status(400).send({
        error: 'User already exists!',
      })
    }

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const dateAndHour = new Date()

    await knex('users').insert({
      id: randomUUID(),
      username,
      name,
      created_at: dateAndHour.toISOString(),
    })

    return reply.status(201).send()
  })

  app.get('/', async (req, reply) => {
    const users = await knex('users')

    return reply.status(200).send({
      users,
    })
  })
}
