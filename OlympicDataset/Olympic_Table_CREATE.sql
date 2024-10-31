CREATE TABLE Countries(
    noc CHAR(3) PRIMARY KEY,
    country_name VARCHAR(255)
);


CREATE TABLE Athletes(
    athlete_id INT PRIMARY KEY,
    name VARCHAR(255),
    Sex VARCHAR(255),
    height INT,
    weight INT,
    born DATE
);


CREATE TABLE Olympic_Games (
    edition_id INT PRIMARY KEY,
    duration INT,
    edition VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country_noc CHAR(3),
    start_date DATE,
    end_date DATE,
    CONSTRAINT FK_country_noc FOREIGN KEY (country_noc) REFERENCES Countries(noc)
);


CREATE TABLE Events (
    event_name VARCHAR(255) NOT NULL,
    sport_name VARCHAR(255) NOT NULL,
    gender VARCHAR(255),
    is_team_sport NUMBER(1),
    edition_id INT,
    PRIMARY KEY (event_name, sport_name, gender, edition_id),
    CONSTRAINT FK_edition_id FOREIGN KEY (edition_id) REFERENCES Olympic_Games(edition_id)
);


CREATE TABLE Olympic_Results ( 
    result_id INT PRIMARY KEY, 
    edition_id INT,
    result_date DATE, 
    result_participants INT, 
    CONSTRAINT FK_EditionID FOREIGN KEY (edition_id) REFERENCES Olympic_Games(edition_id) 
);


CREATE TABLE Medal_Tally (
    edition_id INT, 
    country_noc CHAR(3), 
    gold INT, 
    silver INT, 
    bronze INT, 
    total_medals INT, 
    PRIMARY KEY (edition_id, country_noc), 
    CONSTRAINT FK_EditionMedal FOREIGN KEY (edition_id) REFERENCES Olympic_Games(edition_id),
    CONSTRAINT FK_CountryMedal FOREIGN KEY (country_noc) REFERENCES Countries(noc)
);


CREATE TABLE Athlete_Results ( 
    athlete_id INT, 
    edition_id INT, 
    sport_name VARCHAR(255), 
    event_name VARCHAR(255), 
    result_id INT,
    country_noc CHAR(3), 
    medal VARCHAR(255), 
    pos VARCHAR(255), 
    PRIMARY KEY (athlete_id, result_id, country_noc), 
    CONSTRAINT FK_AthleteID FOREIGN KEY (athlete_id) REFERENCES Athletes(athlete_id),
    CONSTRAINT FK_EditionResult FOREIGN KEY (edition_id) REFERENCES Olympic_Games(edition_id),
    CONSTRAINT FK_CountryResult FOREIGN KEY (country_noc) REFERENCES Countries(noc)
);