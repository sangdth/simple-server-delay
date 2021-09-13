const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");

const PORT = process.env.PORT || 8000;

const app = new Koa();
const router = new Router();

let currentId = 0;
let isReady = false;
let isWorking = false;

function startWorking(id) {
  currentId = id;
  isWorking = true;
  isReady = false;
  setTimeout(() => {
    isReady = true;
  }, Math.round(Math.random() * 10000));
}

router.get("/", async (ctx) => {
  const { id } = ctx.request.query;

  if (!isWorking && id !== currentId) {
    startWorking(id);
    ctx.body = {
      status: "started",
      message: `Start working on id ${id}...`
    };
  } else if (isWorking && !isReady) {
    ctx.body = {
      status: "pending",
      message: `Request for id ${id} NOT ready yet!`
    };
  } else {
    isWorking = false;
    ctx.body = {
      status: "finished",
      message: `Id ${id} is DONE!`
    };
  }
});

app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, "0.0.0.0", () =>
    console.log(`listening on http://localhost:${PORT}...`)
  );
