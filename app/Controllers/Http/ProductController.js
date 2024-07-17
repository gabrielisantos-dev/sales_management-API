'use strict'

const Product = use('App/Models/Product')
const Helpers = use('Helpers')
const { validate } = use('Validator')

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
    const rules = {
      name: 'required|string|max:255',
      sku: 'required|string|max:100|unique:products,sku',
      description: 'string',
      price: 'required|number|min:0',
      quantity_in_stock: 'integer|min:0',
      category: 'string|max:255'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const productData = request.only(['name', 'sku', 'description', 'price', 'quantity_in_stock', 'category'])
    productData.price = parseFloat(productData.price)

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
    const rules = {
      name: 'required|string|max:255',
      sku: `required|string|max:100|unique:products,sku,id,${params.id}`,
      description: 'string',
      price: 'required|number|min:0',
      quantity_in_stock: 'integer|min:0',
      category: 'string|max:255'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const productData = request.only(['name', 'sku', 'description', 'price', 'quantity_in_stock', 'category'])
    productData.price = parseFloat(productData.price)

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
