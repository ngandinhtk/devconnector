const express = require('express');
const app = express();
const connectDB = require('./config/db')
var cors = require('cors')

app.use(cors())

app.get('/', (req, res) => res.send('API running'))

//Init Middleware
app.use(express.json({extends: false}))

app.use('/api/user', require('./routes/api/user'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))

const PORT = process.env.PORT || 5000
connectDB()

app.listen(PORT, () => console.log(`server started on ${PORT}`));