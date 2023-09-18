/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'
import { checkMealExists } from '../middleware/check-meal-exists'
import { checkUserExists } from '../middleware/check-user-exists'

export async function mealsRoutes(app: FastifyInstance | any) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, reply) => {
      const createMealBodySchema = z.object({
        username: z.string(),
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
      })
      const { username, name, description, isDiet } =
        createMealBodySchema.parse(req.body)

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

      const dateAndHour = new Date()

      await knex('meals').insert({
        id: randomUUID(),
        username,
        name,
        description,
        date_hour: dateAndHour.toISOString(),
        isDiet,
      })

      return reply.status(201).send()
    },
  )

  app.post(
    '/:id',
    {
      preHandler: [checkSessionIdExists, checkUserExists, checkMealExists],
    },
    async (req, reply) => {
      const { meal } = req as any

      return reply.status(200).send({
        data: meal,
      })
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists, checkUserExists, checkMealExists],
    },
    async (req, reply) => {
      const { name, description, date_hour, isDiet } = req.body as any

      const { meal } = req as any

      const editMeal = {
        name: name || meal.name,
        description: description || meal.description,
        date_hour: date_hour || meal.date_hour,
        isDiet: isDiet || meal.isDiet,
      }

      console.log(editMeal)

      await knex('meals')
        .where({
          id: meal.id,
        })
        .update(editMeal)

      return reply.status(200).send()
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const listMealParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = listMealParamsSchema.parse(req.params)

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

      const list = await knex('meals').where({
        username: userExists.username,
      })

      console.log(list)
      return reply.status(200).send(list)
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists, checkUserExists, checkMealExists],
    },
    async (req, reply) => {
      const { meal } = req as any

      await knex('meals')
        .where({
          id: meal.id,
        })
        .del()

      return reply.status(200).send()
    },
  )
}
