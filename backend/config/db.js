const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGOURI)
        console.log('Database connected !')
    } catch (error) {
        console.error('Database not connected !', error)
        process.exit(1)
    }
}
module.exports = connectDb;