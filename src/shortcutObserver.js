import * as constant from "./const.js";
import * as util from "./util.js";
import { removeHistoryItem } from "./history.js";
import { removeBookmarkItem } from "./bookmark.js";

const cycleOrder = [
  constant.HISTORY_ITEM_CLASS,
  constant.BOOKMARK_ITEM_CLASS,
  constant.SEARCH_ITEM_CLASS,
];

export function shortcutObserver(
  searchClass,
  autoCompleteClass,
  storeSuggestCandidatesFn,
) {
  $(window).keydown(function (e) {
    const $focused = $(":focus");
    const clazz = $focused.attr("class");

    if (e.code === "Enter") {
      const searchedText = $(util.toId(searchClass)).val();
      storeSuggestCandidatesFn(searchedText);

      // FIXME: as option
      if (clazz?.includes(searchClass) && !e.isComposing && $(util.toId(searchClass)).val()) {
        chrome.search.query({ text: $(util.toId(searchClass)).val() });
        e.preventDefault();
      }
    }

    // Move next/prev history/bookmark
    if ((e.ctrlKey && e.code === "KeyN") || e.code === "ArrowDown") {
      if (clazz?.includes(searchClass)) {
        const firstItemClass = findFirstItemClass();
        setTimeout(
          () => $(util.toClass(firstItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE,
        );
      }

      if (clazz?.includes(constant.HISTORY_ITEM_CLASS)) {
        moveFocus($focused, constant.HISTORY_ITEM_CLASS, "plus");
      }
      if (clazz?.includes(constant.BOOKMARK_ITEM_CLASS)) {
        moveFocus($focused, constant.BOOKMARK_ITEM_CLASS, "plus");
      }
      if (clazz?.includes(constant.SEARCH_ITEM_CLASS)) {
        moveFocus($focused, constant.SEARCH_ITEM_CLASS, "plus");
      }
    }
    if ((e.ctrlKey && e.code === "KeyP") || e.code === "ArrowUp") {
      if (clazz?.includes(constant.HISTORY_ITEM_CLASS)) {
        moveFocus($focused, constant.HISTORY_ITEM_CLASS, "minus");
      }
      if (clazz?.includes(constant.BOOKMARK_ITEM_CLASS)) {
        moveFocus($focused, constant.BOOKMARK_ITEM_CLASS, "minus");
      }
      if (clazz?.includes(constant.SEARCH_ITEM_CLASS)) {
        moveFocus($focused, constant.SEARCH_ITEM_CLASS, "minus");
      }
    }

    // Move history/bookmark
    if ((e.ctrlKey && e.code === "KeyF") || e.code === "ArrowRight") {
      if (cycleOrder.includes(clazz)) {
        const nextIndex = findNextIndex(clazz);
        setTimeout(
          () => $(util.toClass(cycleOrder[nextIndex])).get(0).focus(),
          constant.MOVE_DEBOUNCE,
        );
      }
    }
    if ((e.ctrlKey && e.code === "KeyB") || e.code === "ArrowLeft") {
      if (cycleOrder.includes(clazz)) {
        const prevIndex = findPrevIndex(clazz);
        setTimeout(
          () => $(util.toClass(cycleOrder[prevIndex])).get(0).focus(),
          constant.MOVE_DEBOUNCE,
        );
      }
    }

    // Search by google
    if (e.metaKey && e.code === "Enter") {
      if (clazz?.includes(searchClass) && $(util.toId(searchClass)).val()) {
        chrome.search.query({ text: $(util.toId(searchClass)).val() });
        e.preventDefault();
      }
    }

    // Apply suggestion
    if ((e.ctrlKey && e.code === "KeyE") || e.code === "Tab") {
      if (clazz?.includes(searchClass) && $(util.toId(searchClass)).val()) {
        const suggestion = document.getElementById(autoCompleteClass).innerText;
        $(util.toId(searchClass)).val(suggestion);
        e.preventDefault();
      }
    }

    // Focus search box
    if (e.metaKey && e.code === "KeyF") {
      $(util.toId(searchClass)).focus();
      e.preventDefault();
    }
    if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
      $(util.toId(searchClass)).focus();
      e.preventDefault();
    }

    // Unfocus search box
    if (e.code === "Escape") {
      $(util.toId(searchClass)).blur();
      e.preventDefault();
    }

    // Clear search box
    if (e.ctrlKey && e.code === "KeyG") {
      $(util.toId(searchClass)).val("");
      e.preventDefault();
    }

    // Copy URL
    if ((e.metaKey || e.ctrlKey) && e.code === "KeyC") {
      if (
        clazz?.includes(constant.HISTORY_ITEM_CLASS) ||
        clazz?.includes(constant.BOOKMARK_ITEM_CLASS)
      ) {
        const aElement = $focused[0];
        navigator.clipboard.writeText(aElement.href);
        aElement.classList.add("flush");
        setTimeout(() => aElement.classList.remove("flush"), 100);
      }
      e.preventDefault();
    }

    // Remove history, bookmark item
    if ((e.metaKey || e.ctrlKey) && e.code === "KeyK") {
      const aElement = $focused[0];
      if (clazz?.includes(constant.HISTORY_ITEM_CLASS)) {
        removeHistoryItem(aElement.href);
        aElement.classList.add("removed-item");
        e.preventDefault();
      }
      if (clazz?.includes(constant.BOOKMARK_ITEM_CLASS)) {
        removeBookmarkItem(aElement.href);
        aElement.classList.add("removed-item");
        e.preventDefault();
      }
    }
  });
}

function findNextIndex(clazz) {
  const currentIndex = cycleOrder.findIndex((item) => clazz === item);
  const nextIndex =
    currentIndex + 1 > cycleOrder.length - 1 ? 0 : currentIndex + 1;
  const nextItemExist = $(util.toClass(cycleOrder[nextIndex])).length > 0;

  if (nextItemExist) {
    return nextIndex;
  } else {
    return findNextIndex(cycleOrder[nextIndex]);
  }
}

function findPrevIndex(clazz) {
  const currentIndex = cycleOrder.findIndex((item) => clazz === item);
  const prevIndex =
    currentIndex - 1 < 0 ? cycleOrder.length - 1 : currentIndex - 1;
  const prevItemExist = $(util.toClass(cycleOrder[prevIndex])).length > 0;

  if (prevItemExist) {
    return prevIndex;
  } else {
    return findPrevIndex(cycleOrder[prevIndex]);
  }
}

function findFirstItemClass() {
  return cycleOrder.find((itemClass) => {
    return $(util.toClass(itemClass)).length > 0;
  });
}

function moveFocus($focused, itemClass, operator) {
  const index = $(util.toClass(itemClass)).index($focused);
  const next = operator === "plus" ? index + 1 : index - 1;
  setTimeout(() => {
    if ($(util.toClass(itemClass)).get(next)) {
      $(util.toClass(itemClass)).get(next).focus();
    } else {
      $(util.toClass(itemClass)).get(0).focus();
    }
  }, constant.MOVE_DEBOUNCE);
}
