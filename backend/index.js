// For Secrets - npm install dotenv
// Create a .env file in the root directory and add the following:
// DB_USER=your_username 
//DB_PASSWORD=your_password 
//DB_CONNECT_STRING=oracle.cise.ufl.edu/orcl
/*Example:
DB_USER=yvoryk
DB_PASSWORD=eTLkdmDdbp3l7La4bXXHIt31
DB_CONNECT_STRING=oracle.cise.ufl.edu/orcl*/
require('dotenv').config();

const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');

// For Redis - npm install redis
//cd C:\Redis-x64-3.0.504 (Navigate to the Redis Directory)
//.\redis-server.exe
// If not installed on machine - brew install redis(only for mac users)
// To Start - redis-server in new terminal window
const redis = require("redis");
const client = redis.createClient();
// Debug for Redis to let you know if it's working
(async () => {
    try {
      await client.connect();
      console.log("Redis client connected successfully");
    } catch (err) {
      console.error("Redis client connection error:", err);
    }
  })();


const app = express();
app.use(cors({ origin: ['http://localhost:3000'] }));
app.use(express.json());

const PORT = 3001;

// Change these as necessary before running
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Giant list of country codes in our DB and those used by the frontend's map library paired up.
const nocmap = {
    "BAN": "BD",
    "BEL": "BE",
    "BUR": "BF",
    "BUL": "BG",
    "BRU": "BN",
    "BOL": "BO",
    "JPN": "JP",
    "BDI": "BI",
    "BEN": "BJ",
    "BHU": "BT",
    "JAM": "JM",
    "BOT": "BW",
    "BRA": "BR",
    "BLR": "BY",
    "BIZ": "BZ",
    "RWA": "RW",
    "SRB": "RS",
    "TLS": "TL",
    "TKM": "TM",
    "TJK": "TJ",
    "ROU": "RO",
    "GUA": "GT",
    "GRE": "GR",
    "GUY": "GY",
    "GEO": "GE",
    "GBR": "GB",
    "GAB": "GA",
    "GUI": "GN",
    "GHA": "GH",
    "OMA": "OM",
    "TUN": "TN",
    "JOR": "JO",
    "CRO": "HR",
    "HAI": "HT",
    "HUN": "HU",
    "HON": "HN",
    "PUR": "PR",
    "PLE": "PS",
    "POR": "PT",
    "PAR": "PY",
    "PAN": "PA",
    "PNG": "PG",
    "PER": "PE",
    "PAK": "PK",
    "PHI": "PH",
    "POL": "PL",
    "ZAM": "ZM",
    "EST": "EE",
    "EGY": "EG",
    "RSA": "ZA",
    "ECU": "EC",
    "ITA": "IT",
    "VIE": "VN",
    "ETH": "ET",
    "SOM": "SO",
    "ZIM": "ZW",
    "ESP": "ES",
    "ERI": "ER",
    "MNE": "ME",
    "MAD": "MG",
    "MAR": "MA",
    "UZB": "UZ",
    "MYA": "MM",
    "MLI": "ML",
    "MGL": "MN",
    "MKD": "MK",
    "MAW": "MW",
    "MTN": "MR",
    "UGA": "UG",
    "MAS": "MY",
    "MEX": "MX",
    "ISR": "IL",
    "FRA": "FR",
    "FIN": "FI",
    "FIJ": "FJ",
    "NCA": "NI",
    "NED": "NL",
    "NOR": "NO",
    "NAM": "NA",
    "VAN": "VU",
    "NIG": "NE",
    "NGR": "NG",
    "NZL": "NZ",
    "NEP": "NP",
    "KOS": "XK",
    "SUI": "CH",
    "COL": "CO",
    "CMR": "CM",
    "CHI": "CL",
    "CAN": "CA",
    "CGO": "CG",
    "CYP": "CY",
    "CRC": "CR",
    "CUB": "CU",
    "SWZ": "SZ",
    "SYR": "SY",
    "KGZ": "KG",
    "KEN": "KE",
    "SUR": "SR",
    "CAM": "KH",
    "ESA": "SV",
    "SVK": "SK",
    "SLO": "SI",
    "KUW": "KW",
    "SEN": "SN",
    "SLE": "SL",
    "KAZ": "KZ",
    "SWE": "SE",
    "SUD": "SD",
    "DJI": "DJ",
    "DEN": "DK",
    "GER": "DE",
    "YEM": "YE",
    "ALG": "DZ",
    "USA": "US",
    "URU": "UY",
    "LBN": "LB",
    "TTO": "TT",
    "SRI": "LK",
    "LAT": "LV",
    "LTU": "LT",
    "LUX": "LU",
    "LBR": "LR",
    "LES": "LS",
    "THA": "TH",
    "TOG": "TG",
    "CHA": "TD",
    "LBA": "LY",
    "UAE": "AE",
    "VEN": "VE",
    "AFG": "AF",
    "IRQ": "IQ",
    "ISL": "IS",
    "ARM": "AM",
    "ALB": "AL",
    "ANG": "AO",
    "ARG": "AR",
    "AUS": "AU",
    "AUT": "AT",
    "IND": "IN",
    "AZE": "AZ",
    "IRL": "IE",
    "INA": "ID",
    "UKR": "UA",
    "QAT": "QA",
    "MOZ": "MZ",
    "CHN": "CN",
    "RUS": "RU",
    "LYB": "LY",
    "BOL": "BO",
    "MTN": "MR",
    "MLI": "ML",
    "GBS": "GW",
    "SLE": "SL",
    "LBR": "LR",
    "CIV": "CI",
    "BEN": "BJ",
    "CHA": "TD",
    "COD": "CG",
    "CAF": "CF",
    "KSA": "SA",
    "YEM": "YE",
    "OMA": "OM",
    "IRI": "IR",
    "TUR": "TR",
    "CZE": "CZ",
    "BIH": "BA",
    "MDA": "MD",
    "ALB": "AL",
    "NCA": "NI",
    "BIZ": "BZ",
    "HON": "HN",
    "DOM": "DO",
    "MAD": "MG",
    "CGO": "CG",
    "COD": "CD",
    "ANG": "AO",
    "TAN": "TZ",
    "MAW": "MW",
    "NEP": "NP",
    "BAN": "BD",
    "BHU": "BT",
    "MYA": "MM",
    "LAO": "LA",
    "CAM": "KH",
    "KOR": "KR",
    "PRK": "KP",
    "PNG": "PG",
    "SSD": "SS",
    "SOM": "SO",
    "LES": "LS",
};

app.get("/api/sports", async (req, res) => {let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const query = `
            SELECT DISTINCT sport_name
            FROM Events
            ORDER BY sport_name ASC
        `;
        const result = await connection.execute(query);
        const sports = result.rows.map(([sport_name]) => sport_name);
        res.json(sports);
    } catch (err) {
        console.error("Error fetching sports:", err);
        res.status(500).send("Failed to fetch sports.");
    } finally {
        if (connection) {
            await connection.close();
        }
    }});

app.get("/api/medaldensity", async (req, res) => {
    const { sport } = req.query;
    if (!sport) {
        return res.status(400).send("Sport parameter is required.");
    }
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const query = `
            SELECT 
                CASE
                    WHEN e.gender = 'none' THEN e.event_name || ', Mixed'
                    ELSE e.event_name || ', ' || e.gender
                END AS full_event_name,
                e.sport_name,
                COALESCE(COUNT(DISTINCT ar.athlete_id), 0) AS total_participants,
                COALESCE(SUM(CASE WHEN ar.medal IS NOT NULL THEN 1 ELSE 0 END), 0) AS total_medals,
                ROUND(
                    CASE
                        WHEN COUNT(DISTINCT ar.athlete_id) = 0 THEN 0
                        ELSE SUM(CASE WHEN ar.medal IS NOT NULL THEN 1 ELSE 0 END) / COUNT(DISTINCT ar.athlete_id)
                    END, 2
                ) AS medal_density,
                ROUND(
                    CASE
                        WHEN SUM(CASE WHEN ar.medal IS NOT NULL THEN 1 ELSE 0 END) = 0 THEN 0
                        ELSE COUNT(DISTINCT ar.athlete_id) / SUM(CASE WHEN ar.medal IS NOT NULL THEN 1 ELSE 0 END)
                    END, 2
                ) AS athlete_medal_ratio,
                EXTRACT(YEAR FROM g.start_date) AS year
            FROM 
                Events e
            LEFT JOIN 
                Athlete_Results ar 
            ON 
                CASE 
                    WHEN e.gender = 'none' THEN e.event_name || ', Mixed'
                    ELSE e.event_name || ', ' || e.gender
                END = ar.event_name 
                AND e.sport_name = ar.sport_name 
                AND e.edition_id = ar.edition_id
            JOIN 
                Olympic_Games g 
            ON 
                e.edition_id = g.edition_id
            WHERE 
                e.sport_name = :sport
            GROUP BY 
                e.event_name, e.sport_name, e.gender, g.start_date
            ORDER BY 
                e.event_name ASC, medal_density DESC
        `;

        const results = await connection.execute(query, [sport]);

        const formattedResults = results.rows.map(([full_event_name, sport_name, total_participants, total_medals, medal_density, athlete_medal_ratio, year]) => ({
            full_event_name,
            sport_name,
            total_participants,
            total_medals,
            medal_density,
            athlete_medal_ratio,
            year
        }));
        
        res.json(formattedResults);

    } catch (err) {
        console.error("Error fetching events and medal data:", err);
        res.status(500).send("Failed to fetch events and medal data");
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

app.get("/api/overtimegraph", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        
        const query = `
        SELECT 
            EXTRACT(YEAR FROM g.start_date) AS year,
            SUM(NVL(mt.gold, 0)) AS gold,
            SUM(NVL(mt.silver, 0)) AS silver,
            SUM(NVL(mt.bronze, 0)) AS bronze,
            SUM(NVL(mt.gold, 0) + NVL(mt.silver, 0) + NVL(mt.bronze, 0)) AS total_medals,
            NVL(ar.total_athletes, 0) AS total_athletes,
            CASE
                WHEN EXTRACT(YEAR FROM g.start_date) = 1906 THEN 0
                WHEN NVL(ar.total_athletes, 0) = 0 THEN 0
                ELSE ROUND(SUM(NVL(mt.gold, 0) + NVL(mt.silver, 0) + NVL(mt.bronze, 0)) / ar.total_athletes, 3)
            END AS efficiency
        FROM Olympic_Games g
        LEFT JOIN (
            SELECT 
                mt.edition_id,
                SUM(NVL(mt.gold, 0)) AS gold,
                SUM(NVL(mt.silver, 0)) AS silver,
                SUM(NVL(mt.bronze, 0)) AS bronze,
                SUM(NVL(mt.gold, 0) + NVL(mt.silver, 0) + NVL(mt.bronze, 0)) AS total_medals
            FROM Medal_Tally mt
            GROUP BY mt.edition_id
        ) mt ON g.edition_id = mt.edition_id
        LEFT JOIN (
            SELECT 
                edition_id,
                COUNT(DISTINCT athlete_id) AS total_athletes
            FROM Athlete_Results
            GROUP BY edition_id
        ) ar ON g.edition_id = ar.edition_id
        WHERE EXTRACT(YEAR FROM g.start_date) BETWEEN 1908 AND 2022
        GROUP BY EXTRACT(YEAR FROM g.start_date), mt.gold, mt.silver, mt.bronze, mt.total_medals, ar.total_athletes
        ORDER BY year ASC
        `;

        const results = await connection.execute(query);

        const goldData = [];
        const silverData = [];
        const bronzeData = [];
        const totalData = [];
        const efficiencyData = [];

        results.rows.forEach(([year, gold, silver, bronze, total, total_athletes, efficiency]) => {
            goldData.push({ year, medals: gold });
            silverData.push({ year, medals: silver });
            bronzeData.push({ year, medals: bronze });
            totalData.push({ year, medals: total });
            efficiencyData.push({ year, efficiency: efficiency });
        });

        res.json({gold: goldData, silver: silverData, bronze: bronzeData, total: totalData, efficiency: efficiencyData});
    } catch(err) {
        console.error("Error fetching medals over time data:", err);
        res.status(500).send("Failed to fetch medals over time data");
    } finally {
        if (connection) {
            await connection.close();
        }
    }
    });



app.get("/api/countrytable", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const query = `
        SELECT c.noc AS code,
            c.country_name AS country,
            SUM(NVL(mt.gold, 0)) AS gold,
            SUM(NVL(mt.silver, 0)) as silver,
            SUM(NVL(mt.bronze, 0)) as bronze,
            SUM(NVL(mt.gold, 0) + NVL(mt.silver, 0) + NVL(mt.bronze, 0)) AS total
        FROM Countries c
        JOIN Medal_Tally mt ON c.noc = mt.country_noc
        GROUP BY c.noc, c.country_name
        ORDER BY total DESC, gold DESC, silver DESC, bronze DESC
        `;
        const results = await connection.execute(query);
        const medals = results.rows.map(([code, country, gold, silver, bronze, total]) => {
            return {
                code,
                country,
                gold,
                silver,
                bronze,
                total
            };
        });
        res.json(medals);

    } catch (err) {
        console.error("Error fetching country table data:", err);
        res.status(500).send("Failed to fetch country table data");
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

app.get("/api/worldmap", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const query = `
            SELECT c.noc AS code,
                SUM(mt.gold) AS gold,
                SUM(mt.silver) as silver,
                SUM(mt.bronze) as bronze
            FROM Countries c
            JOIN Medal_Tally mt ON c.noc = mt.country_noc
            GROUP BY c.noc
        `;

        const results = await connection.execute(query);
        const medals = results.rows.map(([dbCode, gold, silver, bronze]) => {
            const mapCode = nocmap[dbCode] || dbCode;
            return {
                code: mapCode,
                gold,
                silver,
                bronze,
            };
        });
        res.json(medals);

    } catch (err) {
        console.error("Error fetching world map data:", err);
        res.status(500).send("Failed to fetch world map data");
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// API Endpoint: Custom Search Tool 
app.post('/api/search', async (req, res) => {
    const { country, sport, athlete, event } = req.query;
    // Limit the number of results returned, default to 10
    const limit = parseInt(req.query.limit, 10) || 10;

    // Generate a unique cache key based on the search parameters
    const cacheKey = `search:${country || 'all'}:${sport || 'all'}:${athlete || 'all'}:${event || 'all'}:limit:${limit}`;

    let connection;
    try {
        // Check Redis cache for existing data
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            console.log(`Data retrieved from cache for ${cacheKey}`);
            return res.json(JSON.parse(cachedData));
        }

        connection = await oracledb.getConnection(dbConfig);

        // Query to fetch athlete results based on search parameters
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
        FETCH FIRST :limit ROWS ONLY
        `;

        const binds = {
            country: country || null,
            sport: sport || null,
            athlete: athlete || null,
            event: event || null,
            limit,
        };

        const results = await connection.execute(query, binds);

        // Cache the results in Redis with a 5-minute expiration
        await client.set(cacheKey, JSON.stringify(results.rows), { EX: 300 });

        //Uncomment to debug Cache Key
        //console.log(`Cached data for ${cacheKey}`);

        res.json(results.rows);
    } catch (err) {
        console.error('Error querying database', err);
        res.status(500).send('Database query failed');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});


// API Endpoint: Get Data for Specific Country
app.get("/api/country-data/:code", async (req, res) => {
    const inputCode = req.params.code.toUpperCase();
    const dbCode = Object.keys(nocmap).find((key) => nocmap[key] === inputCode) || inputCode;
    const cacheKey = `country-data:${dbCode}`;

    // Uncomment to debug Cache Key
    //console.log("Generated Cache Key:", cacheKey);


    let connection;
    try {
        //Check Redis cache
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            // Uncomment to debug Cached data
            //console.log(`Data retrieved from cache for ${cacheKey}`);
            return res.json(JSON.parse(cachedData));
        }
        connection = await oracledb.getConnection(dbConfig);

    // Query to get medal data for a specific country
    const query = `
             SELECT EXTRACT(YEAR FROM g.start_date) AS year,
                SUM(NVL(mt.gold, 0)) AS gold,
                SUM(NVL(mt.silver, 0)) AS silver,
                SUM(NVL(mt.bronze, 0)) AS bronze,
                SUM(NVL(mt.gold, 0) + NVL(mt.silver, 0) + NVL(mt.bronze, 0)) AS total
            FROM Olympic_Games g
            JOIN Medal_Tally mt ON g.edition_id = mt.edition_id
            WHERE mt.country_noc = :dbCode
            GROUP BY EXTRACT(YEAR FROM g.start_date)
            ORDER BY year ASC
        `;
  
    const binds = { dbCode };
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
       
    const result = await connection.execute(query, binds, options);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "No data found for the specified country." });
    }

    // Cache data in Redis, cache with 300 seconds (5 minutes) expiration
    await client.set(cacheKey, JSON.stringify(result.rows), { EX: 300 });

    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing database connection:", err.message);
      }
    }
  }
});

// API Endpoint: Dropdown Options
app.get("/api/options", async (req, res) => {
    const { country, sport } = req.query;
    const cacheKey = `dropdown-options:${country || "all"}:${sport || "all"}`;

    let connection;
    try {
        // Check Redis cache
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            console.log(`Data retrieved from cache for ${cacheKey}`);
            return res.json(JSON.parse(cachedData));
        }

        connection = await oracledb.getConnection(dbConfig);
        console.log("Incoming request query parameters:", req.query);

        let countries = [], sports = [], events = [];

        if (sport) {
            // Fetch events based on selected sport and optionally country
            const eventQuery = `
                SELECT DISTINCT event_name
                FROM Athlete_Results
                WHERE sport_name = :sport
                  AND (:country IS NULL OR country_noc = (SELECT noc FROM Countries WHERE country_name = :country))
                ORDER BY event_name
            `;
            const binds = { sport: sport || null, country: country || null };

            // Uncomment to debug the query and binds
            //console.log("Executing eventQuery with binds:", binds);

            const eventResults = await connection.execute(eventQuery, binds);
            events = eventResults.rows.map(row => row[0]);

        } else if (country) {
            // Fetch sports based on selected country
            const sportQuery = `
                SELECT DISTINCT sport_name
                FROM Athlete_Results
                WHERE country_noc = (SELECT noc FROM Countries WHERE country_name = :country)
                ORDER BY sport_name
            `;
            const binds = { country };
            // Uncomment to debug the query and binds
            //console.log("Executing sportQuery with binds:", binds);

            const sportResults = await connection.execute(sportQuery, binds);
            sports = sportResults.rows.map(row => row[0]);

        } else {
            // Fetch all countries with associated sports and fetch all sports
            const countryQuery = `
                SELECT DISTINCT c.country_name
                FROM Countries c
                JOIN Athlete_Results ar ON c.noc = ar.country_noc
                ORDER BY c.country_name
            `;
            // Fetch all sports again for dropdown options
            const sportQuery = "SELECT DISTINCT sport_name FROM Athlete_Results ORDER BY sport_name";

            // Uncomment to debug the queries
            //console.log("Executing queries to fetch all countries with sports and all sports");

            const [countryResults, sportResults] = await Promise.all([
                connection.execute(countryQuery),
                connection.execute(sportQuery)
            ]);

            // extract country names and sport names from the query results
            countries = countryResults.rows.map(row => row[0]);
            sports = sportResults.rows.map(row => row[0]);
        }

        const result = { countries, sports, events };

        // Cache the results in Redis with a 5-minute expiration
        await client.set(cacheKey, JSON.stringify(result), { EX: 300 });
        console.log(`Cached data for ${cacheKey}`);
        return res.json(result);
    } catch (err) {
        console.error("Error fetching dropdown options:", err);
        res.status(500).send("Failed to fetch dropdown options");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing database connection:", err.message);
            }
        }
    }
});
  
// uncomment to test the connection
// testConnection()

app.listen(PORT, () => {
    console.log(`Backend running on localhost:${PORT}`);
})
