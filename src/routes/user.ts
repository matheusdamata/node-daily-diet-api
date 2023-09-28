/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

const userMetricsSchema = z.object({
  id: z.string().uuid(),
})

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

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, reply) => {
      const { id } = userMetricsSchema.parse(req.params)

      const userExists = await knex('users')
        .where({
          id,
        })
        .first()

      if (!userExists) {
        return reply.status(401).send({
          error: 'User not exists!',
        })
      }

      const meals = await knex('meals').where({
        username: userExists.username,
      })

      const totalMeals = meals.length

      const totalIsDiet = meals.reduce(
        (count, meal) => count + (meal.isDiet === 1 ? 1 : 0),
        0,
      )

      const totalNotDiet = meals.reduce(
        (count, meal) => count + (meal.isDiet === 0 ? 1 : 0),
        0,
      )

      let bestSequenceFromDiet = 0

      for (const meal of meals) {
        if (meal.isDiet === 1) {
          bestSequenceFromDiet++
        } else {
          break
        }
      }

      const response = {
        totalMeals,
        totalIsDiet,
        totalNotDiet,
        bestSequenceFromDiet,
      }

      console.log(response)

      return reply.status(200).send(response)
    },
  )
}
