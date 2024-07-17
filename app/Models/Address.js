'use strict'

const Model = use('Model')

class Address extends Model {
  client() {
    return this.belongsTo('App/Models/Client')
  }
}

module.exports = Address
