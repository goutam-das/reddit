import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createConnection } from 'typeorm';

(async () => {
    try {
        await createConnection();
        console.log('DB connected');
        const app = express();
        // Middlewares
        app.use(express.json());
        app.get('/', (_: Request, res: Response) => {
            return res.send('Hello from Server');
        })
        app.listen(process.env.PORT);
        console.log(`Server listen on port: ${process.env.PORT}`);
    } catch (error) {
        console.error(error);
    }
})();