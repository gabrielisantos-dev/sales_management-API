'use strict'

const Client = use('App/Models/Client')
const Sale = use('App/Models/Sale')
const { validate } = use('Validator')

class ClientController {
  async index({ response }) {
    const clients = await Client.query()
      .select('id', 'name', 'cpf')
      .orderBy('id')
      .fetch()
    return response.json(clients)
  }

  async show({ params, request, response }) {
    const { month, year } = request.get()
    const client = await Client.findOrFail(params.id)
    let salesQuery = Sale.query().where('client_id', client.id).orderBy('sale_date', 'desc')
    
    if (month && year) {
      salesQuery = salesQuery.whereRaw('MONTH(sale_date) = ?', [month]).whereRaw('YEAR(sale_date) = ?', [year])
    }
    
    const sales = await salesQuery.fetch()
    return response.json({ client, sales })
  }

  async store({ request, response }) {
    const rules = {
      name: 'required|string|max:255',
      cpf: 'required|string|max:14|unique:clients,cpf',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const clientData = request.only(['name', 'cpf'])
    const client = await Client.create(clientData)

    const addressData = request.input('address')
    if (addressData) {
      await client.addresses().create(addressData)
    }

    const phoneData = request.input('phone')
    if (phoneData) {
      await client.phones().create(phoneData)
    }

    return response.json(client)
  }

  async update({ params, request, response }) {
    const rules = {
      name: 'required|string|max:255',
      cpf: `required|string|max:14|unique:clients,cpf,id,${params.id}`,
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const clientData = request.only(['name', 'cpf'])
    const client = await Client.findOrFail(params.id)
    client.merge(clientData)
    await client.save()

    const addressData = request.input('address')
    if (addressData) {
      const address = await client.addresses().firstOrCreate({}, addressData)
      client.address = address
    }

    const phoneData = request.input('phone')
    if (phoneData) {
      const phone = await client.phones().firstOrCreate({}, phoneData)
      client.phone = phone
    }

    return response.json(client)
  }

  async delete({ params, response }) {
    const client = await Client.findOrFail(params.id)
    await client.delete()
    await Sale.query().where('client_id', params.id).delete()
    await client.addresses().delete()
    await client.phones().delete()
    return response.json({ message: 'Cliente, vendas, endereços e telefones foram excluídos' })
  }
}

module.exports = ClientController
