// deno-lint-ignore no-window-prefix
window.addEventListener("load", () => {
  if (window.location.host !== "cms.e.jimdo.com") {
    novelSupport("#content_area", { content: "html" });
  }
});

declare function novelSupport(elem: string, options: {
  content?: string;
}): void;
