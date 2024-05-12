import { fs } from "./deps.ts";
import { routeApi } from "./router.ts";

const pattern = new URLPattern({ pathname: "/api/:name+" });

Deno.serve((req: Request) => {
  const matchResult = pattern.exec(req.url);
  if (matchResult) {
    // api请求
    return routeApi(matchResult.pathname.input, req);
  } else {
    // 静态页面请求
    return fs.serveDir(req, {
      fsRoot: "../frontend/dist",
      quiet: false,
      showDirListing: true,
      showDotfiles: true,
    });
  }
});
