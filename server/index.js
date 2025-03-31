import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';

configDotenv();
const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
