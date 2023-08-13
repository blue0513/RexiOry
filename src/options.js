const saveOptions = () => {
  const ignoreUrls = document.getElementById("ignoreUrls").value;

  chrome.storage.sync.set({ ignoreUrls: ignoreUrls }, () => {
    const status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 750);
  });
};

const restoreOptions = () => {
  chrome.storage.sync.get({ ignoreUrls: "" }, (items) => {
    document.getElementById("ignoreUrls").value = items.ignoreUrls;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
