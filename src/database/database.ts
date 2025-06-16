import { Pool } from 'pg'
import dotenv from 'dotenv'

// .config 
dotenv.config()

// .settings
const db_connector = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASS,
    port: 5432,
})

// .operations 

export class DataBase {
    public async Table() {
        const client = await db_connector.connect()

        //creating table Users and Posts
        const query_1 = `
        CREATE TABLE IF NOT EXISTS USERS_DATA (
          id VARCHAR(250) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          passwd VARCHAR(250) NOT NULL,
          createdAt TIMESTAMP DEFAULT NOW()
        );
        `;

        //executing the query
        try {
            await client.query(query_1);
        } catch (error) {
            console.log("an error creating tables users and post")
        } finally {
            client.release();
        }
    }

    public async REGISTER_USER(data: { id: string, name: string, email: string, password: string }) {
        await this.Table()
        const client = await db_connector.connect()
        const query = `
        INSERT INTO USERS_DATA (id,name,email,passwd,createdAt)
        VALUES ($1,$2,$3,$4,now())
        RETURNING *;`
        try {
            const result = await client.query(query, [data.id, data.name, data.email, data.password]);
            await client.query('COMMIT');
            //console.log(result.rows[0])
            return { data: result.rows[0], success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            console.log(error)
            //console.log("an error while creating user")
            return {
                error: true
            }
        } finally {
            client.release();
        }
    }

    public async Log_in_USER(data: { email: string }) {
        await this.Table()
        const client = await db_connector.connect()
        const query = `
        SELECT * FROM USERS_DATA WHERE email = $1;`
        try {
            const result = await client.query(query, [data.email]);
            //console.log(result.rows)
            return {
                status: true,
                data: result.rows
            };
        } catch (error) {
            await client.query('ROLLBACK');
            console.log("an error while selecting account")
            return {
                status: false,
            }
        } finally {
            client.release();
        }
    }
}
