export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function faviconURL(u) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u); // this encodes the URL as well
  url.searchParams.set("size", "32");
  return url.toString();
}

export function focusSearchBar(searchClass) {
  // HACK: Focus out address-bar
  // https://stackoverflow.com/a/71424805/8888451
  if (location.search !== "?x") {
    location.search = "?x";
  }

  // Focus search box
  $(toId(searchClass)).focus();
}

export function toClass(className) {
  return `.${className}`;
}

export function toId(idName) {
  return `#${idName}`;
}
