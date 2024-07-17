'use strict'

const Model = use('Model')

class Product extends Model {
  sales() {
    return this.hasMany('App/Models/Sale')
  }
}

module.exports = Product
