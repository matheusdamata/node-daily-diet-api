/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function checkUserExists(
  req: FastifyRequest | any,
  reply: FastifyReply,
) {
  const checkUserBodySchema = z.object({
    username: z.string(),
  })

  const { username } = checkUserBodySchema.parse(req.body)

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

  const user = userExists
  req.user = user
}
