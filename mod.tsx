/** @jsx h */
import {
  type Handler,
  serve,
} from "https://deno.land/std@0.117.0/http/server.ts";
import { h, html } from "https://deno.land/x/htm@0.0.10/mod.tsx";
import { isExistFileSync } from "https://pax.deno.dev/windchime-yk/deno-util@v1.6.0/file.ts";
import { contentType } from "https://deno.land/std@0.152.0/media_types/mod.ts";

const handler: Handler = async (req) => {
  const { pathname } = new URL(req.url);
  const TITLE = "WhyK Resources";

  if (pathname === "/") {
    return html({
      lang: "ja",
      title: TITLE,
      body: (
        <section>
          <h1>{TITLE}</h1>
          <p>このサービスはWhyKが静的資材を配信するために作られました。</p>
        </section>
      ),
    });
  }

  const router = new URLPattern({ pathname: "/:type/*" });
  const typeName = router.exec(req.url)?.pathname.groups.type;
  const fileName = `./src/${pathname}`;

  if (isExistFileSync(fileName)) {
    if (typeName === "js") {
      const jsFile = await Deno.readFile(fileName);
      return new Response(jsFile, {
        headers: {
          "Content-Type": contentType(typeName),
        },
      });
    }
  }

  return html({
    lang: "ja",
    title: `404 Not Found | ${TITLE}`,
    body: (
      <section>
        <h1>404 Not Found</h1>
        <p>存在しないコンテンツにアクセスしているようです。TOPページに移動してください。</p>
      </section>
    ),
  });
};

const PORT = 8080;
serve(handler, { addr: `:${PORT}` });
console.log(`listen to http://localhost:${PORT}`);