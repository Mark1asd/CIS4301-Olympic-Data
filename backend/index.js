const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Change these as necessary before running
const dbConfig = {
    user: '',
    password: '',
    connectString: 'oracle.cise.ufl.edu/orcl'
};

// Fetch dropdown options
app.get("/api/options", async (req, res) => {
    const { sport_selection } = req.query;
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);

      let countries = [], sports = [], events = [];

      if(sport_selection){
        const eventQuery = `
        SELECT DISTINCT event_name
        FROM Athlete_Results
        WHERE sport_name = :sport_selection
        ORDER BY event_name`;
        const eventResults = await connection.execute(eventQuery, [sport_selection]);
        events = eventResults.rows.map(row => row[0]);
      } else{
        // Fetch distinct values for each dropdown
        const [countryResults, sportResults, eventResults] = await Promise.all([
            connection.execute("SELECT DISTINCT country_name FROM Countries ORDER BY country_name"),
            connection.execute("SELECT DISTINCT sport_name FROM Athlete_Results ORDER BY sport_name"),
            connection.execute("SELECT DISTINCT event_name FROM Athlete_Results ORDER BY event_name"),
        ]);

        countries = countryResults.rows.map(row => row[0]);
        sports = sportResults.rows.map(row => row[0]);
        events = eventResults.rows.map(row => row[0]);
      }
  
      res.json({
        countries,
        sports,
        events,
      });
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
      res.status(500).send("Failed to fetch dropdown options");
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  });

// Test function to make sure you can connect to your local db instance.
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

app.post('/api/search', async (req, res) => {
    const { country, sport, athlete, event } = req.query;
    let connection;
    try{
        connection = await oracledb.getConnection(dbConfig);

        const query = `
        SELECT 
            a.name AS athlete_name,
            c.country_name,
            ar.sport_name,
            ar.event_name,
            ar.medal
        FROM Athlete_Results ar
        JOIN Athletes a ON ar.athlete_id = a.athlete_id
        JOIN Countries c ON ar.country_noc = c.noc
        WHERE 1=1
            AND (:country IS NULL OR c.country_name = :country)
            AND (:sport IS NULL OR ar.sport_name = :sport)
            AND (:athlete IS NULL OR a.name = :athlete)
            AND (:event IS NULL OR ar.event_name = :event)
        FETCH FIRST 10 ROWS ONLY
        `;
        
        const binds = {
            country: country || null,
            sport: sport || null,
            athlete: athlete || null,
            event: event || null,
        }
        
        const results = await connection.execute(query, binds);
        res.json(results.rows);

    } catch (err) {
        console.error('Error querying database', err);
        res.status(500).send('Database query failed');
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

testConnection()

app.listen(PORT, () => {
    console.log(`Backend running on localhost:${PORT}`);
})