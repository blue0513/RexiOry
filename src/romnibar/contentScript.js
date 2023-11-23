chrome.runtime.onMessage.addListener(async (message) => {
  if (message.command !== "show") return;

  if (document.getElementById("iframe-container")) {
    document.getElementById("iframe-container")?.remove();
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("index.html");
  const container = document.createElement("div");
  container.setAttribute("id", "iframe-container");

  container.appendChild(iframe);
  document.body.appendChild(container);
});
