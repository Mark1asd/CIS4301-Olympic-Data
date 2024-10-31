import pandas as pd
import re
import os

dir_path = "Olympic_INSERT_statements"
os.makedirs(dir_path, exist_ok=True)

def clean_symbols(line):
    line = line.replace("×", "x")
    line = line.replace("&", "&&")
    line = line.replace("≤", "<=")
    line = line.replace("≥", ">=")
    line = line.replace("–", "-")
    #line = re.sub(r"[^a-zA-Z0-9\s\-_&',]", "_", line)
    return line

# ---------- ATHLETE RESULTS --------------------------------------------------------------------------------------------------------------
# If this file doesn't let you attach a connection in VSCode, then, in the Athlete_Results_INSERT.sql file, select all, cut, rename the file (at this point, there should be a "connection" option)
# then, UNDO the renaming (ctrl-z), and paste the contents back into the file. I have no idea why this is an issue, why this fixes it, or how I figured it out.

athlete_results_df = pd.read_csv("Olympic_Athlete_Event_Results.csv", usecols=["edition_id", "sport", "event", "result_id", "country_noc", "athlete_id", "pos", "medal"])

def parse_position(pos):
    if pd.isna(pos):
        return None
    
    if re.match(r'^\d+', pos):
        return int(re.match(r'^\d+', pos).group())
    elif pos.startswith(("DNS", "DNF", "AC", "DQ", "NR")):
        return pos.split()[0]
    
    return None
    
def ATHLETE_RESULTS_insert_generation(df, table):
    df_unique = df.drop_duplicates(subset=["athlete_id", "result_id", "country_noc"])

    insert_statements = []
    for _, row in df_unique.iterrows():
        athlete_id = row['athlete_id']
        edition_id = row['edition_id']
        sport_name = row['sport'].replace("'", "''")
        sport_name = clean_symbols(sport_name)
        event_name = row['event'].replace("'", "''")
        event_name = clean_symbols(event_name)
        result_id = row['result_id']
        country_noc = row['country_noc']

        medal = f"'{row['medal']}'" if not pd.isna(row['medal']) else "NULL"

        pos = parse_position(row['pos'])
        pos = f"'{pos}'" if pos else "NULL"

        values = values = f"{athlete_id}, {edition_id}, '{sport_name}', '{event_name}', {result_id}, '{country_noc}', {medal}, {pos}"
        statement = f"INSERT INTO {table} (athlete_id, edition_id, sport_name, event_name, result_id, country_noc, medal, pos) VALUES ({values});"
        insert_statements.append(statement)
    return insert_statements

table_name = "Athlete_Results"
athlete_results_insert_statements = ATHLETE_RESULTS_insert_generation(athlete_results_df, table_name)

write_path = "Olympic_INSERT_statements/Athlete_Results_INSERT.sql"
if os.path.exists(write_path):
    os.remove(write_path)
    print(f"Existing file '{write_path}' removed to avoid duplication")

counter = 0
with open(write_path, "a", encoding="utf-8") as file:
    file.write("--If this file doesn't let you attach a connection in VSCode, then, in the Athlete_Results_INSERT.sql file, select all, cut, rename the file (at this point, there should be a \"connection\" option)\n")
    file.write("--then, UNDO the renaming (ctrl-z), and paste the contents back into the file. I have no idea why this is an issue, why this fixes it, or how I figured it out.")
    file.write("SET DEFINE OFF;\n")
    file.write("SET FEEDBACK OFF;\n")
    for statement in athlete_results_insert_statements:
        file.write(statement + "\n")
        counter += 1
        if(counter == 10000):
            file.write("COMMIT;\n")
            counter = 0
    file.write("COMMIT;\n\n")


print("Athletes Results INSERT statements generated successfully.")

# ---------- EVENTS --------------------------------------------------------------------------------------------------------------
events_df = pd.read_csv("Olympic_Athlete_Event_Results.csv", usecols=["event", "sport", "edition_id", "isTeamSport"])

def parse_event_gender(event):
    if "Men" in event:
        return event.replace(", Men", "").strip(), "Men"
    elif "Women" in event:
        return event.replace(", Women", "").strip(), "Women"
    return event.strip(), None

def EVENTS_insert_generation(df, table):
    unique_events = df.drop_duplicates(subset=["event", "sport", "edition_id"]).copy()
    
    insert_statements = []
    for _, row in unique_events.iterrows():
        edition_id = row['edition_id']
        sport_name = row['sport'].replace("'", "''")
        sport_name = clean_symbols(sport_name)

        event_name, gender = parse_event_gender(row['event'])
        event_name = event_name.replace("'", "''")
        event_name = clean_symbols(event_name)

        is_team_sport = 1 if row['isTeamSport'] == True else 0

        values = f"'{event_name}', '{sport_name}', '{gender}', {is_team_sport}, {edition_id}"
        statement = f"INSERT INTO {table} (event_name, sport_name, gender, is_team_sport, edition_id) VALUES ({values});"
        insert_statements.append(statement)

    return insert_statements

table_name = "Events"
events_insert_statements = EVENTS_insert_generation(events_df, table_name)

write_path = "Olympic_INSERT_statements/Events_INSERT.sql"
if os.path.exists(write_path):
    os.remove(write_path)
    print(f"Existing file '{write_path}' removed to avoid duplication")

counter = 0
with open(write_path, "a", encoding="utf-8") as file:
    file.write("SET DEFINE OFF;\n")
    file.write("SET FEEDBACK OFF;\n")
    for statement in events_insert_statements:
        file.write(statement + "\n")
        counter += 1
        if(counter == 10000):
            file.write("COMMIT;\n")
            counter = 0
    file.write("COMMIT;\n\n")

print("Events INSERT statements generated successfully.")

# ---------- MEDAL TALLY --------------------------------------------------------------------------------------------------------------
medal_tally_df = pd.read_csv("Olympic_Games_Medal_Tally.csv", usecols=["edition_id", "country_noc", "gold", "silver", "bronze", "total"])
def MEDALS_insert_generation(df, table):
    insert_statements = []
    for _, row in df.iterrows():
        edition_id = row['edition_id']
        country_noc = row['country_noc']
        
        gold = int(row['gold']) if pd.notna(row['gold']) else 0
        silver = int(row['silver']) if pd.notna(row['silver']) else 0
        bronze = int(row['bronze']) if pd.notna(row['bronze']) else 0
        total_medals = int(row['total']) if pd.notna(row['total']) else 0

        values = f"{edition_id}, '{country_noc}', {gold}, {silver}, {bronze}, {total_medals}"
        statement = f"INSERT INTO {table} (edition_id, country_noc, gold, silver, bronze, total_medals) VALUES ({values});"
        insert_statements.append(statement)

    return insert_statements

table_name = "Medal_Tally"
medal_tally_insert_statements = MEDALS_insert_generation(medal_tally_df, table_name)

write_path = "Olympic_INSERT_statements/Medal_Tally_INSERT.sql"
if os.path.exists(write_path):
    os.remove(write_path)
    print(f"Existing file '{write_path}' removed to avoid duplication")

counter = 0
with open(write_path, "a", encoding = "utf-8") as file:
    file.write("SET DEFINE OFF;\n")
    file.write("SET FEEDBACK OFF;\n")
    for statement in medal_tally_insert_statements:
        file.write(statement + "\n")
        counter += 1
        if(counter == 10000):
            file.write("COMMIT;\n")
            counter = 0
    file.write("COMMIT;\n\n")

print("Medal Tally INSERT statements generated successfully.")


# ---------- OLYMPIC RESULTS --------------------------------------------------------------------------------------------------------------
results_df = pd.read_csv("Olympic_Results.csv", usecols=["result_id", "edition_id", "result_date", "result_participants"])

def parse_date(date):
    if pd.isna(date):
        return None
    date_match = re.search(r'\d{1,2} \w+ \d{4}', date)
    if(date_match):
        date = pd.to_datetime(date_match.group(), errors="coerce")
        return date.strftime("%Y-%m-%d") if pd.notna(date) else None
    return None

def parse_participants(participants):
    if pd.isna(participants):
        return None
    participants_match = re.search(r'\d+', participants)
    return int(participants_match.group()) if participants_match else None

def RESULTS_insert_generation(df, table):
    insert_statements = []
    for _, row in df.iterrows():
        result_id = row['result_id']
        edition_id = row['edition_id']

        result_date = parse_date(row['result_date'])
        result_date = f"TO_DATE('{result_date}', 'YYYY-MM-DD')" if result_date else "NULL"

        result_participants = parse_participants(row['result_participants'])
        result_participants = f"'{result_participants}'" if result_participants else "NULL"

        # result_location = row['result_location'].replace("'", "''").replace("&", "&&") if pd.notna(row['result_location']) else "NULL"
        # result_location = f"'{result_location}'" if result_location != "NULL" else "NULL"

        values = f"{result_id}, {edition_id}, {result_date}, {result_participants}"
        statement = f"INSERT INTO {table} (result_id, edition_id, result_date, result_participants) VALUES ({values});"
        insert_statements.append(statement)
    return insert_statements

table_name = "Olympic_Results"
results_insert_statements = RESULTS_insert_generation(results_df, table_name)

write_path = "Olympic_INSERT_statements/Olympic_Results_INSERT.sql"
if os.path.exists(write_path):
    os.remove(write_path)
    print(f"Existing file '{write_path}' removed to avoid duplication")

counter = 0
with open(write_path, "a", encoding = "utf-8") as file:
    file.write("SET DEFINE OFF;\n")
    file.write("SET FEEDBACK OFF;\n")
    for statement in results_insert_statements:
        file.write(statement + "\n")
        counter += 1
        if(counter == 10000):
            file.write("COMMIT;\n")
            counter = 0
    file.write("COMMIT;\n\n")

print("Results INSERT statements generated successfully.")

# ---------- OLYMPIC GAMES --------------------------------------------------------------------------------------------------------------
games_df = pd.read_csv("Olympics_Games.csv", usecols=["edition", "edition_id", "year", "city", "country_noc", "start_date", "end_date"])

def GAMES_insert_generation(df, table):
    insert_statements = []
    for _, row in df.iterrows():
        edition_id = row['edition_id']
        edition = row['edition'].replace("'", "''")
        city = row['city'].replace("'", "''").replace("&", "&&")
        country_noc = row['country_noc']

        start_date = pd.to_datetime(f"{row['start_date']} {edition[:4]}", errors='coerce')
        start_date = f"TO_DATE('{start_date.strftime('%Y-%m-%d')}', 'YYYY-MM-DD')" if pd.notna(start_date) else "NULL"

        end_date = pd.to_datetime(f"{row['end_date']} {edition[:4]}", errors='coerce')
        end_date = f"TO_DATE('{end_date.strftime('%Y-%m-%d')}', 'YYYY-MM-DD')" if pd.notna(end_date) else "NULL"
        
        values = f"{edition_id}, '{edition}', '{city}', '{country_noc}', {start_date}, {end_date}"
        statement = f"INSERT INTO {table} (edition_id, edition, city, country_noc, start_date, end_date) VALUES ({values});"
        insert_statements.append(statement)

    return insert_statements

table_name = "Olympic_Games"
games_insert_statements = GAMES_insert_generation(games_df, table_name)

write_path = "Olympic_INSERT_statements/Olympic_Games_INSERT.sql"
if os.path.exists(write_path):
    os.remove(write_path)
    print(f"Existing file '{write_path}' removed to avoid duplication")

counter = 0
with open(write_path, "a", encoding = "utf-8") as file:
    file.write("SET DEFINE OFF;\n")
    file.write("SET FEEDBACK OFF;\n")
    for statement in games_insert_statements:
        file.write(statement + "\n")
        counter += 1
        if(counter == 10000):
            file.write("COMMIT;\n")
            counter = 0
    file.write("COMMIT;\n\n")

print("Olympic Games INSERT statements generated successfully.")

# ---------- ATHLETES --------------------------------------------------------------------------------------------------------------
athletes_df = pd.read_csv("Olympic_Athlete_Bio.csv", usecols=["athlete_id","name","sex","born","height","weight"])

def parse_first_value(value):
    if pd.isna(value): return None
    matches = re.match(r'\d+(\.\d+)?', str(value))
    return matches.group() if matches else "NULL"

def ATHLETES_insert_generation(df, table):
    insert_statements = []
    for _, row in df.iterrows():
        athlete_id = row['athlete_id']
        name = row['name'].replace("'", "''").replace("&", "&&")
        sex = row['sex']

        born = pd.to_datetime(row['born'], errors='coerce')
        born = f"TO_DATE('{born.strftime('%Y-%m-%d')}', 'YYYY-MM-DD')" if not pd.isna(born) else "NULL"

        height = row['height'] if not pd.isna(row['height']) else "NULL"
        height = parse_first_value(height)

        weight = row['weight'] if not pd.isna(row['weight']) else "NULL"
        weight = parse_first_value(weight)

        values = f"'{athlete_id}', '{name}', '{sex}', {height}, {weight}, {born}"

        statement = f"INSERT INTO {table} (athlete_id, name, sex, height, weight, born) VALUES ({values});"
        insert_statements.append(statement)

    return insert_statements

table_name = "Athletes"
athlete_insert_statements = ATHLETES_insert_generation(athletes_df, table_name)

write_path = "Olympic_INSERT_statements/Athletes_INSERT.sql"
if os.path.exists(write_path):
    os.remove(write_path)
    print(f"Existing file '{write_path}' removed to avoid duplication")

counter = 0
with open(write_path, "a", encoding = "utf-8") as file:
    file.write("SET DEFINE OFF;\n")
    file.write("SET FEEDBACK OFF;\n")
    for statement in athlete_insert_statements:
        file.write(statement + "\n")
        counter += 1
        if(counter == 10000):
            file.write("COMMIT;\n")
            counter = 0
    file.write("COMMIT;\n\n")

print("Athlete INSERT statements generated successfully.")

# ---------- COUNTRIES --------------------------------------------------------------------------------------------------------------
countries_df = pd.read_csv("Olympics_Country.csv")

def COUNTRY_insert_generation(df, table):
    insert_statements = []
    for _, row in df.iterrows():
        noc = row['noc']
        country = row['country'].replace("'", "''")
        statement = f"INSERT INTO {table} (noc, country_name) VALUES ('{noc}', '{country}');"
        insert_statements.append(statement)

    return insert_statements

table_name = "Countries"
country_insert_statements = COUNTRY_insert_generation(countries_df, table_name)

write_path = "Olympic_INSERT_statements/Countries_INSERT.sql"
if os.path.exists(write_path):
    os.remove(write_path)
    print(f"Existing file '{write_path}' removed to avoid duplication")

counter = 0
with open(write_path, "a", encoding = "utf-8") as file:
    file.write("SET DEFINE OFF;\n")
    file.write("SET FEEDBACK OFF;\n")
    for statement in country_insert_statements:
        file.write(statement + "\n")
        counter += 1
        if(counter == 10000):
            file.write("COMMIT;\n")
            counter = 0
    file.write("COMMIT;\n\n")

print("Country INSERT statements generated successfully.")

# ---------- MASTER FILE CREATION --------------------------------------------------------------------------------------------------------------
# If this file doesn't let you attach a connection in VSCode, then, in the Athlete_Results_INSERT.sql file, select all, cut, rename the file (at this point, there should be a "connection" option)
# then, UNDO the renaming (ctrl-z), and paste the contents back into the file. I have no idea why this is an issue, why this fixes it, or how I figured it out.
write_path = "Olympic_INSERT_statements/Master_INSERT.sql"
if os.path.exists(write_path):
    os.remove(write_path)
    print(f"Existing file '{write_path}' removed to avoid duplication")

with open(write_path, "a", encoding="utf-8") as file:
    file.write("--If this file doesn't let you attach a connection in VSCode, then, in the Athlete_Results_INSERT.sql file, select all, cut, rename the file (at this point, there should be a \"connection\" option)\n")
    file.write("--then, UNDO the renaming (ctrl-z), and paste the contents back into the file. I have no idea why this is an issue, why this fixes it, or how I figured it out.")
    for filename in ["Countries_INSERT.sql", "Olympic_Games_INSERT.sql", "Olympic_Results_INSERT.sql", "Events_INSERT.sql", "Athletes_INSERT.sql", "Medal_Tally_INSERT.sql", "Athlete_Results_INSERT.sql"]:
        file_path = os.path.join(dir_path, filename)
        with open(file_path, "r", encoding="utf-8") as insertfile:
            file.write(insertfile.read())
            file.write("\n\n")
        print(f"{filename} successfully written to master file.")

print(f"All INSERT statements successfully combined into {write_path}")