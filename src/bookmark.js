import Fuse from "../third-party/fuse.esm.js";

export async function dumpBookmarks(query) {
  const bookmarkTreeNodes = await chrome.bookmarks.getTree();
  return buildBookmarkItems(bookmarkTreeNodes, query);
}

export async function removeBookmarkItem(url) {
  const bookmarks = await chrome.bookmarks.search({ url });
  if (bookmarks[0]?.id) {
    await chrome.bookmarks.remove(bookmarks[0].id);
  }
}

function buildBookmarkItems(bookmarkTreeNodes, query) {
  const bookmarks = dumpTreeNodes(bookmarkTreeNodes);

  if (!query) {
    return bookmarks;
  }

  const fuse = buildFuseObject(bookmarks);
  return fuse.search(query ?? "").map((res) => {
    return { title: res.item.title, url: res.item.url };
  });
}

function dumpTreeNodes(bookmarkNodes) {
  return bookmarkNodes.reduce((acc, node) => {
    return (acc = acc.concat(dumpNode(node)));
  }, []);
}

function dumpNode(bookmarkNode) {
  const hasChildren = !!bookmarkNode.children;
  return !hasChildren ? [bookmarkNode] : dumpTreeNodes(bookmarkNode.children);
}

function buildFuseObject(bookmarks) {
  const fuseTarget = bookmarks.slice().map((bookmark) => {
    return { title: bookmark.title, url: bookmark.url };
  });
  const fuse = new Fuse(fuseTarget, {
    keys: ["title", "url"],
    shouldSort: true,
  });

  return fuse;
}
