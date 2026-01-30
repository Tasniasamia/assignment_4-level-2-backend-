import { type Request, type Response } from 'express';
import cors from 'cors'
import "dotenv/config";
import notFound from './middleware/notFound';
import errorHandler from './middleware/globalErrorHandler';
import route from './routes';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({origin: ["http://localhost:3000"], 
credentials: true, 
}))
app.use("/api",route);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})


app.use(notFound);
app.use(errorHandler);
export default app;
