import * as constant from "./const.js";
import * as util from "./util.js";
import { removeHistoryItem } from "./history.js";
import { removeBookmarkItem } from "./bookmark.js";

export function shortcutObserver(
  historyItemClass,
  bookmarkItemClass,
  searchClass,
  suggestClass,
  storeSuggestCandidatesFn,
) {
  $(window).keydown(function (e) {
    const $focused = $(":focus");
    const clazz = $focused.attr("class");

    if (e.code === "Enter") {
      const searchedText = $(util.toId(searchClass)).val();
      storeSuggestCandidatesFn(searchedText);
    }

    // Move next/prev history/bookmark
    if ((e.ctrlKey && e.code === "KeyN") || e.code === "ArrowDown") {
      if (clazz?.includes(searchClass)) {
        setTimeout(
          () => $(util.toClass(historyItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE,
        );
      }

      if (clazz?.includes(historyItemClass)) {
        moveFocus($focused, historyItemClass, "plus");
      }
      if (clazz?.includes(bookmarkItemClass)) {
        moveFocus($focused, bookmarkItemClass, "plus");
      }
    }
    if ((e.ctrlKey && e.code === "KeyP") || e.code === "ArrowUp") {
      if (clazz?.includes(historyItemClass)) {
        moveFocus($focused, historyItemClass, "minus");
      }
      if (clazz?.includes(bookmarkItemClass)) {
        moveFocus($focused, bookmarkItemClass, "minus");
      }
    }

    // Move history/bookmark
    if ((e.ctrlKey && e.code === "KeyF") || e.code === "ArrowRight") {
      if (clazz?.includes(historyItemClass)) {
        setTimeout(
          () => $(util.toClass(bookmarkItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE,
        );
      }
      if (clazz?.includes(bookmarkItemClass)) {
        setTimeout(
          () => $(util.toClass(historyItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE,
        );
      }
    }
    if ((e.ctrlKey && e.code === "KeyB") || e.code === "ArrowLeft") {
      if (clazz?.includes(historyItemClass)) {
        setTimeout(
          () => $(util.toClass(bookmarkItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE,
        );
      }
      if (clazz?.includes(bookmarkItemClass)) {
        setTimeout(
          () => $(util.toClass(historyItemClass)).get(0).focus(),
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
        const suggestion = document.getElementById(suggestClass).innerText;
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
        clazz?.includes(historyItemClass) ||
        clazz?.includes(bookmarkItemClass)
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
      if (clazz?.includes(historyItemClass)) {
        removeHistoryItem(aElement.href);
        aElement.classList.add("removed-item");
        e.preventDefault();
      }
      if (clazz?.includes(bookmarkItemClass)) {
        removeBookmarkItem(aElement.href);
        aElement.classList.add("removed-item");
        e.preventDefault();
      }
    }
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
