const {createPool}= require('mysql2/promise');

const pool = createPool ({
    host: 'maglev.proxy.rlwy.net',
    user: 'root',
    password: 'GdiRZmJyIbNEuxwCJDtjzOBqBuQSvmPp',
    port: 44477,
    database: 'railway',
})

module.exports=pool;