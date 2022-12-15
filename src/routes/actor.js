import { Hono } from "hono";
import DomParser from "dom-parser";
import { decode as entityDecoder } from "html-entities";
import config from "../../config";
import apiRequestRawHtml from "../helpers/apiRequestRawHtml";
const actor = new Hono();

actor.use("/:id", async (c, next) => {
  const id = c.req.param("id");

  try {
    let get = await CACHE.get(id);
    if (get) {
      c.header("x-cache", "HIT");
      return c.json(JSON.parse(get));
    }
  } catch (_) { }
  await next();
  c.header("x-cache", "MISS");
});

actor.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    let parser = new DomParser();
    let rawHtml = await apiRequestRawHtml(`https://www.imdb.com/name/${id}/`);

    let dom = parser.parseFromString(rawHtml);

    let response = {};

    // schema parse
    let schema = getNode(dom, "script", "application/ld+json");
    schema = JSON.parse(schema.innerHTML);

    // id
    response.id = id;

    // imdb link
    response.imdb = `https://www.imdb.com/title/${id}`;

    // content type
    response.contentType = schema["@type"];

    // original title (if any)
    if (schema.alternateName) {
      response.alertnativeTitle = entityDecoder(schema.alternateName, {
        level: "html5",
      });
    }

    // title
    // response.title = getNode(dom, "h1", "hero-title-block__title").innerHTML;
    response.title = entityDecoder(schema.name, { level: "html5" });

    // image
    response.image = schema.image;

    // plot
    // response.plot = getNode(dom, "span", "plot-l").innerHTML;
    response.plot = entityDecoder(schema.description, { level: "html5" });
    // year and runtime
    try {
      let metadata = getNode(dom, "ul", "hero-title-block__metadata");
      response.year = metadata.firstChild.firstChild.innerHTML;
      response.runtime = metadata.lastChild.innerHTML
        .split("<!-- -->")
        .join("");
    } catch (_) {
      // ignore
    }

    // birth date
    try {
      response.birthDate = schema.birthDate;
    } catch (_) {
      response.birthDate = null;
    }

    // cache data
    if (!config.cacheDisabled) {
      try {
        await CACHE.put(id, JSON.stringify(response), {
          expirationTtl: 86400,
        });
      } catch (_) { }
    }

    return c.json(response);
  } catch (error) {
    c.status(500);
    return c.json({
      message: error.message,
    });
  }
});

export default actor;

function getNode(dom, tag, id) {
  return dom
    .getElementsByTagName(tag)
    .find((e) => e.attributes.find((e) => e.value === id));
}
