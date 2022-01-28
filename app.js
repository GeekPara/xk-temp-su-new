/**
 * Xinkao Temperature Daily Upload
 * Single User Function v1.0
 * Copyright (c) HZGeek 2022.
 * Author: JupiterJun
 */

// 导入包和部分包的实例化
const lib = require("./lib.js");

const Koa = require("koa");
const bodyParse = require("koa-body");
const Router = require("koa-router");
const koa = new Koa();
const app = new Router();

// koa设置默认配置
koa.use(bodyParse());
koa.use(async (ctx, next) => {
  ctx.json = (json) => {
    ctx.body = JSON.stringify(json);
    ctx.type = "application/json";
  };
  await next();
});

// router处理根路径请求
app.post("/", async (ctx) => {
  let data = ctx.request.body;
  if (typeof data === "string") {
    try {
      data = JSON.parse(ctx.request.body);
    } catch {
      data = null;
    }
  }
  if (!data) return ctx.json({ code: -114514, msg: "请求体JSON解析失败" });
  const scf = {
    reqId: ctx.request.header["x-scf-request-id"],
    region: ctx.request.header["x-scf-region"],
    funcName: ctx.request.header["x-scf-name"],
  };
  console.log(JSON.stringify(data)); // 日志

  // 验证请求基本格式
  if (
    !data.mobile ||
    !data.password ||
    !data.dorm ||
    !data.address ||
    !data.headteacher ||
    data.childnum === undefined ||
    data.childnum === null
  ) {
    return ctx.json({ code: -1, msg: "有项目未填" });
  }
  if (!/^1\d{10}$/.test(data.mobile)) {
    return ctx.json({ code: -2, msg: "手机号格式不对" });
  }

  let result = await lib(data);
  result.scf = scf;
  console.log(result);
  return ctx.json(result);
});

// koa监听
koa.use(app.routes());
koa.listen(9000, async () => console.log("Server Started."));
