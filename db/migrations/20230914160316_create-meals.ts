import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('username').notNullable()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.dateTime('date_hour').defaultTo(knex.fn.now()).notNullable()
    table.boolean('isDiet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
