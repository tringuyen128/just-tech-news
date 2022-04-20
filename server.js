const path = require('path')
const express = require('express')
const routes = require('./controllers')
const sequelize = require('./config/connection')

//helper function
const helpers = require('./utils/helpers')

//session used to connect sequelize database
const session = require('express-session')

//express handlebars
const exphbs = require('express-handlebars')
const hbs = exphbs.create({ helpers })

const app = express()
const PORT = process.env.PORT || 3001

const SequelizeStore = require('connect-session-sequelize')(session.Store)

const sess = {
  secret: 'Super secret secret',
  cookie: { maxAge: 36000 },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
}

app.use(session(sess))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(routes)

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'))
})
