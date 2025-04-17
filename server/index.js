import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import requestLogger from "./middleware/requestLogger.js";
import requireAuth from "./middleware/requireAuth.js";

import authRouter from "./routers/auth.js";
import slotRouter from "./routers/slots.js";
import userRouter from "./routers/users.js";
import groupRouter from "./routers/groups.js";
import preconsultFormRouter from "./routers/preconsultationForms.js";

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/slots", requireAuth, slotRouter);
app.use("/api/users", userRouter);
app.use("/api/groups", requireAuth, groupRouter);
app.use("/api/preconsultations", preconsultFormRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
