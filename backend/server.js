const express = require('express');
const connectDB = require('./config/db')
connectDB()
const Profile = require('./models/Profile')
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser')
require('dotenv').config()


app.use((req, _, next) => {
    console.log(req.url)
    next();
})
app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = ["http://localhost:5173"]
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))


logger = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    console.log(method, url, new Date().getFullYear())
    next()
}

// Routes

app.get('/', (req, res) => res.send('API Running'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))
app.use('/api/conversation', require('./routes/api/conversations'))
app.use('/api/message', require('./routes/api/messages'))

// social by user id

app.get('/api/social/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id })
        if (!profile) {
            return res.status(400).json({ msg: 'Profile Not Found' })
        }
        res.json(profile.social)
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'Profile Not Found' })
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Started on ${port}`));
