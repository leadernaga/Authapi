const { Router } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../Models/User.Model')
const validator = require('validator')

const Register = Router()

Register.post('/', async (req, res) => {
  const { first_name, last_name, password, role, email, mobile ,status} = req.body

  if (!first_name || !last_name || !password || !role || !email || !mobile || !status) {
   return res.status(400).send({ message: 'Please Enter All Fields' })
  }

  const Error = {}
  if (!validator.isEmail(email)) {
    Error[email] = 'please enter valid email'
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minSymbols: 1,
    })
  ) {
    return res
      .status(501)
      .send(
        'password should contain atleasr one special charcter one upper case & password minimum length should be 8',
      )
  }
 var mob = mobile+""
  if (mob.length < 10) {
    return res.status(501).send('mobile number should contain 10 numbers')
  }

  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(password, salt)

  try {
      const exist = await User.find({ $or: [{ mobile }, { email }] })
      console.log(exist)

    if (exist.length > 0) {
      if (exist[0].email == email) {
        return res
          .status(400)
          .send({ message: 'email already registered please login' })
      } else if (exist[0].mobile == mobile) {
        return res
          .status(400)
          .send({ message: 'mobile already registered please login' })
      } else {
        return res
          .status(400)
          .send({ message: 'email and mobile already registered please login' })
      }
    }

    const response = await User.create({
      first_name,
      last_name,
      email,
      password: hash,
      role,
        mobile,
      status
    })

    res.status(200).send('Account successfully created')
  } catch (e) {
    res.status(400).send({ message: e.message })
  }
})

module.exports = Register
