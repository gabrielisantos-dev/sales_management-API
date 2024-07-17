'use strict'

const Model = use('Model')

class Address extends Model {
  static get table() {
    return 'addresses'
  }
  
  client() {
    return this.belongsTo('App/Models/Client')
  }
}

module.exports = Address
