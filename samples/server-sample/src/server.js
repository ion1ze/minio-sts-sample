const Koa = require('koa');
const Router = require('@koa/router');
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const FileService = require('./service/file');

const SERVER_PORT = 5000;
const GLOBAL_PERFIX = "/api";

(function(){
  const app = new Koa();
  const router = new Router();
  const fileService = new FileService();

  router.get(`${GLOBAL_PERFIX}/sts/assume-role`,async(ctx)=>{
    const {credentials} = await fileService.assumeRole();
    ctx.body = JSON.stringify({
      code: 0,
      data: {credentials},
      message: 'success'
    });
  });

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.body = JSON.stringify({
        code: -1,
        data: null,
        message: error.message || "未知错误"
      });
    }
  });
  
  app.use(static("./public"));
  app.use(bodyParser());
  app.use(router.routes());
  
  app.listen(SERVER_PORT,()=>{
    console.log(`Server running on port:${SERVER_PORT}.`);
  });
}());

