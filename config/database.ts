import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
    connection: 'pg',
    connections: {
        pg: {
            client: 'pg',
            connection: {
                host: env.get('PGHOST'),
                port: env.get('PGPORT'),
                user: env.get('PGUSER'),
                password: env.get('PGPASSWORD', ''),
                database: env.get('PGDATABASE'),
            },
            migrations: {
                naturalSort: true,
                paths: ['database/migrations'],
            },
        },
    },
})

export default dbConfig