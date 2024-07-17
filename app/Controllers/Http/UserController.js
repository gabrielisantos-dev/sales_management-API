'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {
  async signup({ request, auth, response }) {
    const rules = {
      email: 'required|email|unique:users,email|regex:/^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\\.[a-zA-Z]{2,}$/',
      password: 'required|min:8|regex:/(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}/'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const userData = request.only(['email', 'password'])
    const user = await User.create(userData)
    const token = await auth.generate(user)
    return response.json({ user, token })
  }

  async login({ request, auth, response }) {
    const rules = {
      email: 'required|email|regex:/^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\\.[a-zA-Z]{2,}$/',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).json(validation.messages())
    }

    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return response.json({ token })
  }
}

module.exports = UserController
