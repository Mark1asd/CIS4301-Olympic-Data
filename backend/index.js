const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3001;

// Alter these as necessary, these were just for my own local instance.
const dbConfig = {
    user: 'C##backend_access',
    password: 'backend_pass',
    connectString: '127.0.0.1:1521/FREE'
};

// Test function to make sure you can cannot to your local db instance.
async function testConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');
    } catch(err){
        console.error('Could not connect to Oracle Database', err);
    } finally {
        if(connection){
            await connection.close();
        }
    }
}

// Test application that executes a simple query on DB.
app.get('/', async (req, res) => {
    let connection;
    try{
        connection = await oracledb.getConnection(dbConfig);

        const results = await connection.execute ('SELECT * FROM SYS.Athletes FETCH FIRST 3 ROWS ONLY');
        console.log('Query Results:', results.rows);
        res.json(results.rows);
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Error');
    } finally {
        if(connection){
            try{
                await connection.close();
            } catch(err){
                console.error('Error closing connection', err);
            }
        }
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on localhost:${PORT}`);
})