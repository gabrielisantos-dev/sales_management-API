'use strict'

const Product = use('App/Models/Product')
const Helpers = use('Helpers')
const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')

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
    const product = await Product.query()
      .where('id', params.id)
      .where('is_deleted', false)
      .firstOrFail()

    return response.json(product)
  }

  async store({ request, response }) {
    const schema = Joi.object({
      name: Joi.string().max(255).required(),
      description: Joi.string(),
      price: Joi.number().min(0).required(),
      quantity_in_stock: Joi.number().integer().min(0),
      category: Joi.string().max(255)
    })

    let validatedData

    try {
      validatedData = await schema.validateAsync(request.all(), { abortEarly: false })
    } catch (error) {
      return response.status(400).json(error.details)
    }

    const productData = {
      name: validatedData.name,
      sku: uuidv4(),
      description: validatedData.description,
      price: parseFloat(validatedData.price),
      quantity_in_stock: validatedData.quantity_in_stock || 0,
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

      productData.image_file = `/uploads/${fileName}`
    }

    const product = await Product.create(productData)
    return response.json(product)
  }

  async update({ params, request, response }) {
    const schema = Joi.object({
      name: Joi.string().max(255),
      description: Joi.string(),
      price: Joi.number().min(0),
      quantity_in_stock: Joi.number().integer().min(0),
      category: Joi.string().max(255)
    }).or('name', 'description', 'price', 'quantity_in_stock', 'category')

    let validatedData

    try {
      validatedData = await schema.validateAsync(request.all(), { abortEarly: false })
    } catch (error) {
      return response.status(400).json(error.details)
    }

    const productData = {
      ...validatedData
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

      productData.image_file = `/uploads/${fileName}`
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
