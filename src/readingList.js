import Fuse from "../third-party/fuse.esm.js";
import * as constant from "./const.js";

export async function fetchReadingList(query) {
  const items = await chrome.readingList.query({});
  if (!query) {
    return items;
  }

  const fuse = buildFuseObject(items);

  return fuse.search(query ?? "").map((res) => {
    return { title: res.item.title, url: res.item.url };
  });
}

function buildFuseObject(readingItems) {
  const fuseTarget = readingItems.map((item) => {
    return { title: item.title, url: item.url };
  });

  const fuse = new Fuse(fuseTarget, {
    keys: ["title", "url"],
    shouldSort: constant.SORT_BY_SCORE,
    threshold: constant.SCORE_THRESHOLD,
  });

  return fuse;
}
