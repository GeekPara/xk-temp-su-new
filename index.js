/**
 * Xinkao Temperature Daily Upload
 * Single User Function v1.0
 * Copyright (c) HZGeek 2022.
 * Author: JupiterJun
 */

// 导入包和部分包的实例化
const lib = require("./lib.js");

function scfMain(event, context, callback) {
  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    callback({ code: -114514, msg: "请求体JSON解析失败" });
  }
  const scf = {
    reqId: context.request_id,
    region: context.tencentcloud_region,
    funcName: context.function_name,
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
    return callback({ code: -1, msg: "有项目未填" });
  }
  if (!/^1\d{10}$/.test(data.mobile)) {
    return callback({ code: -2, msg: "手机号格式不对" });
  }

  let result = await lib(data);
  result.scf = scf;
  console.log(result);
  return callback(null, result);
}

exports.main_handler = scfMain;
