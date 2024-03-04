"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/users/user.routes.js";
import { dbConnection } from "./mongo.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = "/opinionAPI/v1/users";
    this.authPath = "/opinionAPI/v1/auth";

    this.middlewares();
    this.conectarDB();
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.authPath, authRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
