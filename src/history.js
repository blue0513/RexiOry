import Fuse from "../third-party/fuse.esm.js";
import * as constant from "./const.js";

export async function dumpHistory(query, ignoreUrls) {
  const microsecondsPerYear = 1000 * 60 * 60 * 24 * 365;
  const oneYearAgo = new Date().getTime() - microsecondsPerYear;

  const searchRes = await chrome.history.search({
    text: "",
    startTime: oneYearAgo,
    maxResults: constant.MAX_HISTORY_RETRIEVE_COUNT,
  });

  return buildHistoryItems(searchRes, query, ignoreUrls);
}

export async function removeHistoryItem(url) {
  await chrome.history.deleteUrl({ url });
}

function buildHistoryItems(historyItems, query, ignoreUrls) {
  const items = filterMostRecentViewedTitles(groupByHistoryTitle(historyItems));
  const targetItems = items.filter(
    (item) => !shouldIgnoreHistoryItem(item.url, ignoreUrls),
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
      (itemA, itemB) => itemA.lastVisitTime > itemB.lastVisitTime,
    )[0];
  });
}

function buildFuseObject(items) {
  return new Fuse(items, {
    keys: ["title", "url"],
    shouldSort: constant.SORT_BY_SCORE,
    threshold: constant.SCORE_THRESHOLD,
  });
}

function shouldIgnoreHistoryItem(url, ignoreUrls) {
  const isDefaultIgnoreUrl = [
    "https://www.google.com/search",
    "chrome-extension",
  ].some((u) => url.startsWith(u));

  const isUserDefinedIgnoreUrl = ignoreUrls.some((u) => url.includes(u));

  return isDefaultIgnoreUrl || isUserDefinedIgnoreUrl;
}
