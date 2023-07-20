import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { CORS as cors } from "https://deno.land/x/oak_cors@v0.1.1/mod.ts";
import logger from "https://deno.land/x/oak_logger/mod.ts";
import { tagsRouter } from './router/tags.ts'

const app = new Application();
const router = new Router();
router
    .use("/tags", tagsRouter.routes(), tagsRouter.allowedMethods())
    .get(
        "/",
        (ctx) => {
            ctx.body = "这是魔导绪论的后端，请勿调用！！！！";
        },
    );
app
    .use(cors({
        origin: "*",
    }))

    // .use(proxy("/openai", {
    //     target: "https://api.openai.com",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace("/openai", ""),
    //     logs: true,
    // }))
    .use(router.routes())

await app.listen({ port: 8000 });
