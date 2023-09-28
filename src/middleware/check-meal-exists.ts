/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function checkMealExists(
  req: FastifyRequest | any,
  reply: FastifyReply,
) {
  const { user } = req

  const checkMealParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = checkMealParamsSchema.parse(req.params)

  const existsMeal = await knex('meals')
    .where({
      id,
      username: user.username,
    })
    .first()

  if (!existsMeal) {
    return reply.status(401).send({
      error: 'Meals not exists!',
    })
  }

  const meal = existsMeal
  req.meal = meal
}
