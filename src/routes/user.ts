import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    return reply.status(201).send()
  })

  app.get('/', async (req, reply) => {
    const tab = await knex('sqlite_schema').select('*')
    return reply.status(201).send(tab)
  })
}
