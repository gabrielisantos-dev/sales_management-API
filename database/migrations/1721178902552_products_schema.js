'use strict'

const Schema = use('Schema')

class ProductsSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name', 255).notNullable()
      table.string('sku', 100).unique().notNullable()
      table.text('description').nullable()
      table.decimal('price', 12, 2).notNullable()
      table.integer('quantity_in_stock').unsigned().defaultTo(0)
      table.string('category', 255).nullable()
      table.string('image_url', 255).nullable()
      table.boolean('is_deleted').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductsSchema
