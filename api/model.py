from db import create_connection

# method to create user table
def create_user_table():
    conn = create_connection()

    # query to create user table
    query = '''
        CREATE TABLE users (
            email TEXT PRIMARY KEY
            ,password TEXT
        )
    '''

    # execute the query
    conn.execute(query)

    print("Successfully created Users table!")

# method to create statistics table
def create_statistics_table():
    conn = create_connection()

    # query to create statistics table
    query = '''
        CREATE TABLE statistics (
            email TEXT
            ,algorithm TEXT
            ,level INTEGER
            ,time DECIMAL(10, 5)
            ,FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
        )
    '''

    # execute the query
    conn.execute(query)

    print("Successfully created Statistics table!")

if __name__ == "__main__":
    create_user_table()
    create_statistics_table()
