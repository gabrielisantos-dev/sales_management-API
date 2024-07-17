'use strict'

const User = use('App/Models/User')
const Joi = require('joi')

class UserController {
  async signup({ request, auth, response }) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    })

    try {
      const validatedData = await schema.validateAsync(request.all(), { abortEarly: false })
      const { email, password } = validatedData
      const user = await User.create({ email, password })
      const token = await auth.generate(user)
      return response.json({ user, token })
    } catch (error) {
      console.error(error)
      return response.status(400).json({ error: 'Erro ao criar usuário' })
    }
  }

  async login({ request, auth, response }) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })

    try {
      const validatedData = await schema.validateAsync(request.all(), { abortEarly: false })
      const { email, password } = validatedData
      const token = await auth.attempt(email, password)
      return response.json({ token })
    } catch (error) {
      console.error(error)
      return response.status(400).json({ error: 'Credenciais inválidas' })
    }
  }
}

module.exports = UserController
