import express from 'express';
import productsRoutes from './src/routes/products.routes';
import authRoutes from  './src/routes/auth.routes';
import creareRoles, { createRoles } from './src/libs/initialSetup';
const app = express();


createRoles();
app.use(express.json());
app.use('/api/products', productsRoutes);

app.use('/api/auth', authRoutes);

export default app;