const fs = require('fs');
try {
    fs.writeFileSync('debug_start.txt', 'Node is running');
    console.log('Node is running');
} catch (e) {
    console.error(e);
}
