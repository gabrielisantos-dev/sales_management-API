'use strict'

const Model = use('Model')

class Phone extends Model {
  client() {
    return this.belongsTo('App/Models/Client')
  }
}

module.exports = Phone
