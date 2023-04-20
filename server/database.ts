import { bodyParser, cors, Koa, logger, proxy, Router } from "./deps.ts";
import { PromptStoreRouter } from "./router/promptStore.ts";

const app = new Koa();
const router = new Router();
router.use(PromptStoreRouter.routes(), PromptStoreRouter.allowedMethods()).get(
  "/",
  (ctx) => {
    ctx.body = "这是魔导绪论的后端，请勿调用！！！！";
  },
);
app.use(logger())
  .use(cors({
    origin: "*",
  }))
  .use(
    bodyParser(),
  )
  .use(router.routes()).use(router.allowedMethods());

app.listen(80, () => {
  console.log("服务启动了");
});
