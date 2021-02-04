import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { createConnection } from 'typeorm';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './services/auth/routes/auth';
import trim from './middlewares/trim';

(async () => {

    try {
        await createConnection();
        console.log('DB connected');
        const app = express();

        // Middlewares
        app.use(express.json());
        app.use(morgan('dev'));
        app.use(cookieParser());
        app.use(trim);

        // Routes
        app.use('/api/auth', authRoutes);

        app.get('/', (_, res) => {
            return res.send('Hello from Server');
        });

        app.listen(process.env.PORT);
        console.log(`Server listen on port: ${process.env.PORT}`);

    } catch (error) {
        console.error(error);
    }

})();