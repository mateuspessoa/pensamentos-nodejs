const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

//Models
const Tought = require('./models/Tought')
const User = require('./models/User')

//Import Routes
const toughtsRouts = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//Import Controller
const ToughtController = require('./controllers/ToughtController')

//Template Engine
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

//Receber Respostas do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//Session midleware (onde salvar as sessões)
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 36000000,
            expires: new Date(Date.now() + 36000000),
            httpOnly: true
        }
    }),
)

//Configuração das flash messages
app.use(flash())

//Arquivos públicos do projeto
app.use(express.static('public'))

//Salvar a sessão na resposta
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

//Routes
app.use('/toughts', toughtsRouts)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)


conn.sync().then(() => {
    app.listen(3000)
})
.catch((err) => console.log(err))