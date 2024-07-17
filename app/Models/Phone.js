'use strict'

const Model = use('Model')

class Phone extends Model {
  static get table() {
    return 'phones'
  }
  
  client() {
    return this.belongsTo('App/Models/Client')
  }
}

module.exports = Phone
