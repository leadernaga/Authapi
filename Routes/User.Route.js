const { Router } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../Models/User.Model')

const route = Router()

route.get('/', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1]

  try {
    const decoded = jwt.decode(token)

    const user = await User.findById(decoded.id)

    if (!user.email) {
      return res.status(501).send('user not exist')
    }

    delete user.password

    res.status(200).send(user)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

route.get('/all', async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1]

  try {
    // Search patient By Name

    const { First_name,last_name, email, mobile, role, status } = req.query
    
    const users = await User.find({$and:[req.query]
    })

    if (users.length == 0) {
      return res.status(200).send('no users found')
    }

    res.status(200).send(users)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

module.exports = route
