module.exports = (app) => {
  app.get('/findUser', (req) => {
    res.status(200).send('username and jwt token do not match');
  })
}
