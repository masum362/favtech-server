import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./router/router.js";

dotenv.config();
const corsConfig = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["http://localhost:5173"]
      : ["http://localhost:5173"],
  credentials: true,
};

const app = express();

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
