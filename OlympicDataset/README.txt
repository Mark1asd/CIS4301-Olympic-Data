Please download the necessary CSV files for the Olympic Database setup here:
https://www.kaggle.com/datasets/josephcheng123456/olympic-historical-dataset-from-olympediaorg/data?select=Olympic_Athlete_Bio.csv

Place these CSV files in the same directory as the Olympic_Parse_Script.py and run the script with py .\Olympic_Parse_Script.py

The insert statements will be generated inside an Olympic_INSERT_statements directory. The Master_INSERT.sql combines each table's insert statements, and each table will also have its own INSERT.sql file for individual changes.

Lastly, there is the Olympic_Table_CREATE.sql script that creates the necessary tables and the Olympic_Table_DROP.sql script drops ALL tables.
