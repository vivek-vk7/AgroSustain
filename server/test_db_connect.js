const fs = require('fs');
const mongoose = require('mongoose');

fs.writeFileSync('debug_db.txt', 'Starting DB Connection...\n');

mongoose.connect('mongodb://127.0.0.1:27017/agrosustain')
    .then(() => {
        fs.appendFileSync('debug_db.txt', 'MongoDB Connected Successfully!\n');
        console.log('MongoDB Connected');
        process.exit(0);
    })
    .catch((err) => {
        fs.appendFileSync('debug_db.txt', `Error: ${err.message}\n`);
        console.error(err);
        process.exit(1);
    });
