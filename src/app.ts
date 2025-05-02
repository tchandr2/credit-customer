import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import transactionRoutes from "./routes/transaction";

const app = express();


app.use(express.json());

//Routes
app.use('/api/v1/customers', transactionRoutes)
app.use('/api/v1/customers', transactionRoutes)

//Global error handler
app.use(errorHandler);

export default app;


