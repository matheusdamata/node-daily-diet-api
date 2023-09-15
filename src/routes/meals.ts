import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, reply) => {
      const createMealsBodySchema = z.object({
        username: z.string(),
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
      })
      const { username, name, description, isDiet } =
        createMealsBodySchema.parse(req.body)

      const userExists = await knex('users')
        .where({
          username,
        })
        .first()

      if (!userExists) {
        return reply.status(401).send({
          error: 'User not exists!',
        })
      }

      await knex('meals').insert({
        id: randomUUID(),
        username,
        name,
        description,
        date: new Date(),
        isDiet,
      })

      return reply.status(201).send()
    },
  )
}
