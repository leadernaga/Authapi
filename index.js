const express = require('express')
const cors = require('cors')
const connection = require('./Database/db')
const Register = require('./Routes/Register.Route')
const Login = require('./Routes/Login.Route')
const Users = require('./Routes/User.Route')
const Auth = require('./middlewere/Auth')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
  res.status(200).send('app working')
})

app.use('/register', Register)
app.use('/login', Login)
app.use('/users', Auth, Users)

app.listen(process.env.PORT || 8080, async () => {
  try {
    await connection
    console.log('connected to data base')
  } catch (e) {
    console.log('data base not connected here is error', e.message)
  }
  console.log('server started')
})
