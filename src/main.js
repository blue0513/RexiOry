import * as constant from "./const.js";
import * as util from "./util.js";

import { shortcutObserver } from "./shortcutObserver.js";
import { dumpHistory } from "./history.js";
import { dumpBookmarks } from "./bookmark.js";
import { storeSuggestCandidates, findSuggestCandidate } from "./suggest.js";

let preSearchWord = "";

initialize();

//////////////////
// Private Methods
//////////////////

async function initialize() {
  changeHtml();

  // Show history & bookmarks
  document.addEventListener("DOMContentLoaded", async function () {
    await buildHistoryBookmarkList("");
  });

  util.focusSearchBar(constant.SEARCH_FORM_CLASS);

  // Observe user actions
  shortcutObserver(
    constant.HISTORY_ITEM_CLASS,
    constant.BOOKMARK_ITEM_CLASS,
    constant.SEARCH_FORM_CLASS,
    constant.SUGGEST_CLASS,
    storeSuggestCandidates,
  );
  searchInputObserver();

  // Observe option link click
  optionEventObserver();
}

async function buildHistoryBookmarkList(searchWord) {
  // History
  const ignoreUrls = await util.restoreIgnoreUrls();
  const historyItems = await dumpHistory(searchWord, ignoreUrls);
  $(util.toId(constant.HISTORY_LIST_CLASS)).empty();
  buildItemList(
    historyItems,
    constant.HISTORY_LIST_CLASS,
    constant.HISTORY_ITEM_CLASS,
  );

  // Bookmarks
  const bookmarkItems = await dumpBookmarks(searchWord);
  $(util.toId(constant.BOOKMARK_LIST_CLASS)).empty();
  buildItemList(
    bookmarkItems,
    constant.BOOKMARK_LIST_CLASS,
    constant.BOOKMARK_ITEM_CLASS,
  );
}

function buildItemList(data, elementId, itemClass) {
  let ul = document.getElementById(elementId);

  for (let i = 0, ie = data.length; i < ie; ++i) {
    const a = document.createElement("a");
    const title = data[i].title;
    const url = data[i].url;

    a.href = url;
    a.classList.add(itemClass);
    a.appendChild(document.createTextNode(title));

    const img = document.createElement("img");
    img.classList.add("favicon-img");
    img.src = util.faviconURL(url);

    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.appendChild(img);
    li.appendChild(a);

    ul.appendChild(li);
  }
}

async function searchInputObserver() {
  $(util.toId(constant.SEARCH_FORM_CLASS)).keyup(
    util.debounce(async function () {
      const searchWord = $(util.toId(constant.SEARCH_FORM_CLASS)).val();
      if (searchWord === "") {
        document.getElementById(constant.SUGGEST_CLASS).innerText = "";
        return;
      }

      const suggest = (await findSuggestCandidate(searchWord)) ?? "";
      document.getElementById(constant.SUGGEST_CLASS).innerText = suggest;
    }, 10),
  );

  $(util.toId(constant.SEARCH_FORM_CLASS)).keyup(
    util.debounce(async function () {
      const searchWord = $(util.toId(constant.SEARCH_FORM_CLASS)).val();
      if (searchWord === preSearchWord) {
        return;
      }

      const loading = document.getElementById("loading");
      loading.classList.remove("hide");

      await buildHistoryBookmarkList(searchWord);

      loading.classList.add("hide");

      preSearchWord = searchWord;
    }, constant.SEARCH_DEBOUNCE),
  );
}

async function optionEventObserver() {
  document.querySelector("#options")?.addEventListener("click", function () {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  });
}

function changeHtml() {
  const insideIframe = window.self !== window.top;
  if (!insideIframe) return;

  document.head.insertAdjacentHTML("beforeend", '<base target="_parent">');

  const sidebar = document.querySelector(".rexiory-sidebar");
  sidebar.remove();

  const container = document.querySelector(".rexiory-container");
  container.style.marginLeft = "inherit";
  container.style.maxWidth = "inherit";
}
