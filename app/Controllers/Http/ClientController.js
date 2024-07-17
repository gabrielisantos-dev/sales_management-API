'use strict'

const Client = use('App/Models/Client')
const Address = use('App/Models/Address')
const Phone = use('App/Models/Phone')
const Sale = use('App/Models/Sale')
const Joi = require('joi')

class ClientController {
  async index({ response }) {
    try {
      const clients = await Client.query()
        .select('id', 'name', 'cpf')
        .orderBy('id')
        .fetch()

      return response.json(clients)
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao listar clientes.' })
    }
  }

  async show({ params, request, response }) {
    const { month, year } = request.get()

    try {
      const client = await Client.query()
        .where('id', params.id)
        .with('addresses')
        .with('phones')
        .firstOrFail()

      let salesQuery = client.sales().orderBy('sale_date', 'desc')

      if (month && year) {
        salesQuery = salesQuery.whereRaw('MONTH(sale_date) = ?', [month]).whereRaw('YEAR(sale_date) = ?', [year])
      }

      const sales = await salesQuery.fetch()
      return response.json({ client, sales })
    } catch (error) {
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Cliente não encontrado.' })
      }
      return response.status(500).json({ error: 'Erro ao buscar cliente.' })
    }
  }

  async store({ request, response }) {
    const schema = Joi.object({
      name: Joi.string().required(),
      cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/).required(),
      address: Joi.object({
        street: Joi.string(),
        number: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zip_code: Joi.string().pattern(/^\d{5}-\d{3}$/)
      }).required(),
      phone: Joi.object({
        number: Joi.string(),
        area_code: Joi.string()
      }).required(),
    })

    try {
      const validatedData = await schema.validateAsync(request.all(), { abortEarly: false })

      const client = await Client.create({
        name: validatedData.name,
        cpf: validatedData.cpf
      })

      await client.addresses().create(validatedData.address)
      await client.phones().create(validatedData.phone)

      return response.status(201).json(client)
    } catch (error) {
      return response.status(400).json(error.details)
    }
  }

  async update({ params, request, response }) {
    const schema = Joi.object({
      name: Joi.string().max(255),
      cpf: Joi.string().max(14).pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/),
      address: Joi.object({
        street: Joi.string().max(255),
        number: Joi.string().max(10),
        city: Joi.string().max(100),
        state: Joi.string().max(2),
        zip_code: Joi.string().pattern(/^\d{5}-\d{3}$/)
      }),
      phone: Joi.object({
        number: Joi.string().max(20),
        area_code: Joi.string().max(3)
      })
    }).min(1)

    try {
      const validatedData = await schema.validateAsync(request.all(), { abortEarly: false })

      const client = await Client.findOrFail(params.id)
      
      client.merge({
        name: validatedData.name,
        cpf: validatedData.cpf
      })
      await client.save()

      if (validatedData.address) {
        await this.updateAddress(client, validatedData.address)
      }

      if (validatedData.phone) {
        await this.updatePhone(client, validatedData.phone)
      }

      return response.json({
        client: await Client.query().where('id', client.id).with('addresses').with('phones').first()
      })
      
    } catch (error) {
      console.log(error);
      return response.status(400).json(error.details)
    }
  }

  async updateAddress(client, addressData) {
    let address = await Address.query().where('client_id', client.id).first()

    if (!address) {
      address = new Address()
      address.client_id = client.id
    }

    address.merge(addressData)
    await address.save()
  }

  async updatePhone(client, phoneData) {
    let phone = await Phone.query().where('client_id', client.id).first()

    if (!phone) {
      phone = new Phone()
      phone.client_id = client.id
    }

    phone.merge(phoneData)
    await phone.save()
  }

  async delete({ params, response }) {
    try {
      const client = await Client.findOrFail(params.id)
      await Sale.query().where('client_id', params.id).delete()
      await client.addresses().delete()
      await client.phones().delete()
      await client.delete()

      return response.json({ message: 'Cliente excluído com sucesso.' })
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Cliente não encontrado.' })
      }
      return response.status(500).json({ error: 'Erro ao excluir cliente.' })
    }
  }
}

module.exports = ClientController
