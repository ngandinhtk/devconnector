const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURL');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            // useCreateIndex: true
            
        });
        // console.log('MongoDB conneted...');
    } catch (err) {
        console.error(err.message);
        //EXIT PROCESS WITH FAILURE
        process.exit(1)
    }
}

module.exports = connectDB;   