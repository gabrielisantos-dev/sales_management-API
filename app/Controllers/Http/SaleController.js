'use strict'

const Sale = use('App/Models/Sale')
const Product = use('App/Models/Product')
const { validate } = use('Validator')

class SalesController {
  async store({ request, response }) {
    const rules = {
      client_id: 'required|integer',
      product_id: 'required|integer',
      quantity: 'required|integer|min:1',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const { client_id, product_id, quantity } = request.only(['client_id', 'product_id', 'quantity'])

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
