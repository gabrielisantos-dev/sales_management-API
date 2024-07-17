'use strict'

const Schema = use('Schema')

class AddressesSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('CASCADE')
      table.string('street', 255).notNullable()
      table.string('number', 50).notNullable()
      table.string('neighborhood', 255).notNullable()
      table.string('city', 255).notNullable()
      table.string('state', 2).notNullable()
      table.string('zip_code', 8).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressesSchema
