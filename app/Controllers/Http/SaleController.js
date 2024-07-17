'use strict'

const Sale = use('App/Models/Sale')
const Product = use('App/Models/Product')
const Joi = require('joi')

class SalesController {
  async store({ request, response }) {
    const schema = Joi.object({
      client_id: Joi.number().integer().required(),
      product_id: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).required(),
    })

    let validatedData;

    try {
      validatedData = await schema.validateAsync(request.all(), { abortEarly: false })
    } catch (error) {
      return response.status(400).json(error.details)
    }

    const { client_id, product_id, quantity } = validatedData

    try {
      const product = await Product.findOrFail(product_id)

      const unit_price = product.price
      const total_price = unit_price * quantity

      const saleData = {
        client_id,
        product_id,
        quantity,
        unit_price,
        total_price
      }

      const sale = await Sale.create(saleData)
      return response.json(sale)
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao registrar a venda' })
    }
  }
}

module.exports = SalesController
