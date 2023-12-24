import dotenv from "dotenv";
import Fastify from "fastify";
import apiRouter from "../src/routers/api";
import indexRouter from "../src/routers/index";

dotenv.config();

const app = Fastify({
  logger: false,
});

app.register(apiRouter, {
  prefix: "/api",
});

app.register(indexRouter, {
  prefix: "/",
});

export default async (req, res) => {
  await app.ready();
  app.server.emit("request", req, res);
};