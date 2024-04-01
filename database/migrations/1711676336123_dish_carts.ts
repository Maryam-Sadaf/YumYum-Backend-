import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'dish_carts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cart_id').unsigned().references('id').inTable('carts').onDelete('CASCADE')
      table.integer('dish_id').unsigned().references('id').inTable('dishes').onDelete('CASCADE')
      table.unique(['cart_id', 'dish_id'])
      table.integer('quantity').unsigned().notNullable()
      table.integer('price').unsigned().notNullable()

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
