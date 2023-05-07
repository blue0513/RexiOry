import Fuse from "../third-party/fuse.esm.js";
import * as constant from "./const.js";

export async function dumpHistory(query) {
  const microsecondsPerYear = 1000 * 60 * 60 * 24 * 365;
  const oneYearAgo = new Date().getTime() - microsecondsPerYear;

  const searchRes = await chrome.history.search({
    text: "",
    startTime: oneYearAgo,
    maxResults: constant.MAX_HISTORY_RETRIEVE_COUNT,
  });

  return buildHistoryItems(searchRes, query);
}

export async function removeHistoryItem(url) {
  await chrome.history.deleteUrl({ url });
}

function buildHistoryItems(historyItems, query) {
  const items = filterMostRecentViewedTitles(groupByHistoryTitle(historyItems));
  const targetItems = items.filter(
    (item) => !shouldIgnoreHistoryItem(item.url)
  );

  if (!query) {
    return targetItems.slice(0, constant.MAX_HISTORY_VIEW_COUNT);
  }

  const fuse = buildFuseObject(targetItems);
  const result = fuse.search(query ?? "").map((res) => {
    return { url: res.item.url, title: res.item.title };
  });
  return result.slice(0, constant.MAX_HISTORY_VIEW_COUNT);
}

function groupByHistoryTitle(historyItems) {
  return historyItems.reduce((acc, item) => {
    const title = item.title;

    if (acc[title]) {
      acc[title] = acc[title].concat(item);
    } else {
      acc[title] = [item];
    }

    return acc;
  }, {});
}

function filterMostRecentViewedTitles(historyGroup) {
  return Object.keys(historyGroup).map((title) => {
    const items = historyGroup[title];
    return items.sort(
      (itemA, itemB) => itemA.lastVisitTime > itemB.lastVisitTime
    )[0];
  });
}

function buildFuseObject(items) {
  return new Fuse(items, {
    keys: ["title", "url"],
    shouldSort: constant.SHOULD_SORT,
  });
}

function shouldIgnoreHistoryItem(url) {
  return (
    url.startsWith("https://www.google.com/search") ||
    url.startsWith("chrome-extension")
  );
}
