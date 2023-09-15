import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { userRoutes } from './routes/user'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})
