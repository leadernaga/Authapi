const jwt = require('jsonwebtoken')

const Auth = async (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1]

  const verify = jwt.verify(token, 'secret')

  if (!verify) {
    return res
      .status(401)
      .send({ message: 'please login Authontication failed' })
  }

  next()
}

module.exports = Auth