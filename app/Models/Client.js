'use strict'

const Model = use('Model')

class Client extends Model {
  static scopeFindOrFail(query, id) {
    return query.where('id', id).firstOrFail()
  }
  
  sales() {
    return this.hasMany('App/Models/Sale')
  }

  addresses() {
    return this.hasMany('App/Models/Address')
  }

  phones() {
    return this.hasMany('App/Models/Phone')
  }
}

module.exports = Client
