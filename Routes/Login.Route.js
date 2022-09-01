const { Router } = require('express')
const User = require('../Models/User.Model')
var bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Login = Router()

Login.post('/', async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password) {
    res.status(401).send({ message: 'please Enter valid Credentials' })
  }
  try {
    const exist = await User.find({ email })

    if (role !== exist[0].role) {
      return res.status(501).send('you are not belongs to this role')
    }

    if (exist.length == 0) {
      return res
        .status(501)
        .send({ message: 'there is no registred user with this mail' })
    }

    var verify = await bcrypt.compareSync(password, exist[0].password)

    if (!verify) {
      res.status(501).send({ message: 'please enter Correct credentials' })
    }

    const token = jwt.sign(
      { email, id: exist[0]._id },
      'secret',
      { expiresIn: '30d' },
    )

    var userdetails = {
      fist_name: exist[0].first_name,
      last_name: exist[0].first_name,
      role: exist[0].role,
      status: exist[0].status,
      mobile: exist[0].mobile,
      email: exist[0].email,
    }
    delete userdetails['password']
    console.log(userdetails)

    res
      .status(200)
      .send({ message: 'Logged in successfully', data: userdetails, token })
  } catch (e) {
    res.status(401).send({ message: e.message })
  }
})

module.exports = Login
