'use strict'

const Product = use('App/Models/Product')
const Helpers = use('Helpers')
const Joi = require('joi')

class ProductController {
  async index({ request, response }) {
    const { order } = request.get()

    let productsQuery = Product.query()
      .where('is_deleted', false)
      .select('id', 'name', 'price', 'sku', 'quantity_in_stock')

    if (order === 'name') {
      productsQuery = productsQuery.orderBy('name')
    } else if (order === 'price') {
      productsQuery = productsQuery.orderBy('price')
    } else {
      productsQuery = productsQuery.orderBy('name')
    }

    const products = await productsQuery.fetch()
    return response.json(products)
  }

  async show({ params, response }) {
    const product = await Product.findOrFail(params.id)
    return response.json(product)
  }

  async store({ request, response }) {
    const schema = Joi.object({
      name: Joi.string().max(255).required(),
      sku: Joi.string().max(100).required(),
      description: Joi.string(),
      price: Joi.number().min(0).required(),
      quantity_in_stock: Joi.number().integer().min(0),
      category: Joi.string().max(255)
    })

    try {
      const validatedData = await schema.validateAsync(request.all(), { abortEarly: false })
    } catch (error) {
      return response.status(400).json(error.details)
    }

    const productData = {
      name: validatedData.name,
      sku: validatedData.sku,
      description: validatedData.description,
      price: parseFloat(validatedData.price),
      quantity_in_stock: validatedData.quantity_in_stock,
      category: validatedData.category
    }

    const productImage = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    if (productImage) {
      const fileName = `${new Date().getTime()}.${productImage.subtype}`
      await productImage.move(Helpers.publicPath('uploads'), {
        name: fileName,
        overwrite: true
      })

      if (!productImage.moved()) {
        return response.status(400).json({ error: productImage.error().message })
      }

      productData.image_url = `/uploads/${fileName}`
    }

    const product = await Product.create(productData)
    return response.json(product)
  }

  async update({ params, request, response }) {
    const schema = Joi.object({
      name: Joi.string().max(255).required(),
      sku: Joi.string().max(100).required(),
      description: Joi.string(),
      price: Joi.number().min(0).required(),
      quantity_in_stock: Joi.number().integer().min(0),
      category: Joi.string().max(255)
    })

    try {
      const validatedData = await schema.validateAsync(request.all(), { abortEarly: false })
    } catch (error) {
      return response.status(400).json(error.details)
    }

    const productData = {
      name: validatedData.name,
      sku: validatedData.sku,
      description: validatedData.description,
      price: parseFloat(validatedData.price),
      quantity_in_stock: validatedData.quantity_in_stock,
      category: validatedData.category
    }

    const product = await Product.findOrFail(params.id)

    const productImage = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    if (productImage) {
      const fileName = `${new Date().getTime()}.${productImage.subtype}`
      await productImage.move(Helpers.publicPath('uploads'), {
        name: fileName,
        overwrite: true
      })

      if (!productImage.moved()) {
        return response.status(400).json({ error: productImage.error().message })
      }

      productData.image_url = `/uploads/${fileName}`
    }

    product.merge(productData)
    await product.save()
    return response.json(product)
  }

  async delete({ params, response }) {
    const product = await Product.findOrFail(params.id)
    product.is_deleted = true
    await product.save()
    return response.json({ message: 'Produto excluído' })
  }
}

module.exports = ProductController
