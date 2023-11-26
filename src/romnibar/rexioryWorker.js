chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId }) => {
  const injectionCSS = {
    target: { tabId: tabId },
    files: ["css/style.css"],
  };
  chrome.scripting.insertCSS(injectionCSS);
});

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "show": {
      await sendShowCommand();
      break;
    }
  }
});

async function sendShowCommand() {
  const tab = await activeTab();
  if (!tab) return;

  await chrome.tabs.sendMessage(tab.id, { command: "show", tabId: tab.id });
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!!tabs && !!tabs[0]) {
    return tabs[0];
  }
}
