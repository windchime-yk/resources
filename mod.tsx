import { Hono } from "@hono/hono";
import { transpile } from "@deno/emit";
import { contentType } from "@std/media-types";
import { isExistFile } from "@whyk/utils/file";
import { Child } from "@hono/hono/jsx";

const TITLE = "WhyK Resources";
const app = new Hono();

interface LayoutProps {
  subTitle?: string;
  children: Child;
}
const Layout = (props: LayoutProps) => {
  return (
    <html>
      <head>
        <title>{props.subTitle ? `${props.subTitle} | ${TITLE}` : TITLE}</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
        />
      </head>
      <body>
        <header>{TITLE}</header>
        <main>
          {props.children}
        </main>
      </body>
    </html>
  );
};

app.get("/", (c) => {
  return c.html(
    <Layout>
      <section>
        <h1>WhyK Resources</h1>
        <p>このサービスはWhyKが静的資材を配信するために作られました。</p>
      </section>
    </Layout>,
  );
});

app.get("/js/*", async (c) => {
  const pathname = c.req.path;
  const fileName = `assets${pathname}`.replace("/js/", "/ts/").replace(
    ".js",
    ".ts",
  );
  const isExistTsFile = await isExistFile(fileName);

  if (!isExistTsFile) {
    return c.notFound();
  }

  const url = new URL(fileName, import.meta.url);
  const result = await transpile(url, { cacheRoot: "/" });
  const code = result.get(url.href);

  if (!code) {
    return c.notFound();
  }

  return c.body(code, 200, {
    "Content-Type": contentType("js"),
  });
});

app.get("/images/*", async (c) => {
  const pathname = c.req.path;
  const fileName = `assets${pathname}`;
  const imageExtentionList = ["jpg", "jpeg", "png", "svg", "webp"] as const;
  const extentionName = pathname.split(".").at(
    -1,
  ) as typeof imageExtentionList[number];
  const isExistImageFile = await isExistFile(fileName);

  if (!imageExtentionList.includes(extentionName)) {
    return c.notFound();
  }

  if (!isExistImageFile) {
    return c.notFound();
  }

  try {
    const imgFile = await Deno.open(fileName);
    return c.body(imgFile.readable, 200, {
      "Content-Type": contentType(extentionName),
    });
  } catch (_error) {
    return c.notFound();
  }
});

app.notFound((c) => {
  return c.html(
    <Layout subTitle="404 Not Found">
      <section>
        <h1>404 Not Found</h1>
        <p>
          存在しないコンテンツにアクセスしているようです。<a href="/">
            TOPページ
          </a>に移動してください。
        </p>
      </section>
    </Layout>,
    404,
  );
});

Deno.serve({ port: 8080 }, app.fetch);
