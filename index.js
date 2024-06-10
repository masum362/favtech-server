import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./router/router.js";
import run from "./db/connection.js";

dotenv.config();

const corsConfig = {
  credentials: true,
    origin: [
      "http://localhost:5173",
      "https://producthunt-lite.web.app",
      "https://producthunt-lite..firebaseapp.com",
    ]
};


const app = express();

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use("/", router);

const port = process.env.PORT || 3000;
run();
app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
