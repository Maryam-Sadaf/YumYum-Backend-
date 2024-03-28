import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'dishes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('restaurant_id').unsigned().references('id').inTable('restaurants').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.string('description', 1000).notNullable()
      table.integer('price').notNullable()
      table.text('image').notNullable()
      table.boolean('status').defaultTo(true).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
