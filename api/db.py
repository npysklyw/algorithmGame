import sqlite3

# method to create a function
def create_connection():
    # connect to the db file
    conn = sqlite3.connect('./sqlite.db')

    conn.row_factory = sqlite3.Row

    # return the connection
    return conn

# method to get a user using email
def get_user(email):
    conn = create_connection()
    cursor = conn.cursor()

    query = f'''
        SELECT
            *
        FROM
            users
        WHERE
            email=\'{email}\'
    '''
    cursor.execute(query)

    data = cursor.fetchone()

    return dict(data)

# method to get all the statistics of a user
def get_statistics(email):
    conn = create_connection()
    cursor = conn.cursor()

    query = f'''
        SELECT
            algorithm
            ,level
            ,time
        FROM
            statistics stat
        JOIN  users u
            ON (stat.email = u.email)
        WHERE
            u.email=\'{email}\';
    '''
    cursor.execute(query)

    rows = cursor.fetchall()

    # create a data object
    data = list()

    # add the data rows
    for row in rows:
        data.append(dict(row))
    

    return data

# method to add a statistic
def add_statistics(email, algorithm, level, time):
    conn = create_connection()
    cursor = conn.cursor()

    query = f'''
        INSERT INTO statistics (
            email
            ,algorithm
            ,level
            ,time
        ) VALUES (
            \'{email}\'
            ,\'{algorithm}\'
            ,{level}
            ,{time}
        );
    '''
    cursor.execute(query)

    conn.commit()

# get info about the used based on the statistics
def get_user_info(email):
    conn = create_connection()
    cursor = conn.cursor()

    data = dict()

    # get the favorite algorithm
    query = f'''
        SELECT 
            algorithm
        FROM
            statistics stat
        JOIN  users u
            ON (stat.email = u.email)
        WHERE
            u.email=\'{email}\'
        GROUP BY
            algorithm
        ORDER BY
            count(algorithm) DESC;
    '''
    cursor.execute(query)

    rows = cursor.fetchall()
    if rows:
        data['favorite'] = rows[0]['algorithm']

    # get the best time
    query = f'''
        SELECT 
            MIN(time) as MinTime
        FROM
            statistics stat
        JOIN  users u
            ON (stat.email = u.email)
        WHERE
            u.email=\'{email}\'
        GROUP BY
            stat.algorithm
            ,stat.level
        ORDER BY
            level DESC;
    '''
    cursor.execute(query)

    rows = cursor.fetchall()
    if rows:
        data['best_time'] = rows[0]['MinTime']

    # get the highest level
    query = f'''
        SELECT 
            MAX(level) as Maxlevel
        FROM
            statistics stat
        JOIN  users u
            ON (stat.email = u.email)
        WHERE
            u.email=\'{email}\';
    '''
    cursor.execute(query)

    rows = cursor.fetchall()
    if rows:
        data['highest_level'] = rows[0]['MaxLevel']

    # get the total number of games
    query = f'''
        SELECT 
            count(*) as TotalMatches
        FROM
            statistics stat
        JOIN  users u
            ON (stat.email = u.email)
        WHERE
            u.email=\'{email}\';
    '''
    cursor.execute(query)

    rows = cursor.fetchall()
    if rows:
        data['total_games'] = rows[0]['TotalMatches']

    return data

def add_user(email, password):
    conn = create_connection()
    cursor = conn.cursor()

    query = f'''
        INSERT INTO users (
            email
            ,password
        ) VALUES (
            \'{email}\'
            ,\'{password}\'
        );
    '''
    try:
        cursor.execute(query)
    except:
        return { 'success': False, 'msg': 'Email already exists!' }

    conn.commit()

    return { 'success': True, 'msg': 'Successfully added user!' }