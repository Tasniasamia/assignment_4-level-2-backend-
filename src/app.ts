import express, { type Request, type Response } from 'express';
import cors from 'cors'
const app = express()
app.use(express.json());
app.use(express.urlencoded());
app.use(cors())
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

export default app;
