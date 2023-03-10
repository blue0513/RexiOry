import * as constant from "./const.js";
import * as util from "./util.js";

export function shortcutObserver(
  historyItemClass,
  bookmarkItemClass,
  searchClass
) {
  $(window).keydown(function (e) {
    const $focused = $(":focus");
    const clazz = $focused.attr("class");

    // Move next/prev history/bookmark
    if (e.ctrlKey && e.code === "KeyN") {
      if (!!clazz && clazz.includes(searchClass)) {
        setTimeout(
          () => $(util.toClass(historyItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE
        );
      }

      if (!!clazz && clazz.includes(historyItemClass)) {
        moveFocus($focused, historyItemClass, "plus");
      }
      if (!!clazz && clazz.includes(bookmarkItemClass)) {
        moveFocus($focused, bookmarkItemClass, "plus");
      }
    }
    if (e.ctrlKey && e.code === "KeyP") {
      if (!!clazz && clazz.includes(historyItemClass)) {
        moveFocus($focused, historyItemClass, "minus");
      }
      if (!!clazz && clazz.includes(bookmarkItemClass)) {
        moveFocus($focused, bookmarkItemClass, "minus");
      }
    }

    // Move history/bookmark
    if (e.ctrlKey && e.code === "KeyF") {
      if (!!clazz && clazz.includes(historyItemClass)) {
        setTimeout(
          () => $(util.toClass(bookmarkItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE
        );
      }
      if (!!clazz && clazz.includes(bookmarkItemClass)) {
        setTimeout(
          () => $(util.toClass(historyItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE
        );
      }
    }
    if (e.ctrlKey && e.code === "KeyB") {
      if (!!clazz && clazz.includes(historyItemClass)) {
        setTimeout(
          () => $(util.toClass(bookmarkItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE
        );
      }
      if (!!clazz && clazz.includes(bookmarkItemClass)) {
        setTimeout(
          () => $(util.toClass(historyItemClass)).get(0).focus(),
          constant.MOVE_DEBOUNCE
        );
      }
    }

    // Search by google
    if (e.metaKey && e.code === "Enter") {
      if (
        !!clazz &&
        clazz.includes(searchClass) &&
        $(util.toId(searchClass)).val()
      ) {
        chrome.search.query({ text: $(util.toId(searchClass)).val() });
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
        !!clazz &&
        (clazz.includes(historyItemClass) || clazz.includes(bookmarkItemClass))
      ) {
        const aElement = $focused[0];
        navigator.clipboard.writeText(aElement.href);
        aElement.classList.add("flush");
        setTimeout(() => aElement.classList.remove("flush"), 100);
      }
      e.preventDefault();
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
