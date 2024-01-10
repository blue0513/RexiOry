chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "show": {
      const tab = await activeTab();
      if (!tab) return;

      await injectCSS(tab.id);
      await sendShowCommand(tab.id);
      break;
    }
  }
});

async function injectCSS(tabId) {
  const injectionCSS = {
    target: { tabId: tabId },
    files: ["css/style.css"],
  };
  await chrome.scripting.insertCSS(injectionCSS);
}

async function sendShowCommand(tabId) {
  await chrome.tabs.sendMessage(tabId, { command: "show", tabId: tabId });
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!!tabs && !!tabs[0]) {
    return tabs[0];
  }
}
