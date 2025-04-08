chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ hideImages: false, whitelist: [] });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        const url = new URL(tab.url);

        if (url.protocol === "http:" || url.protocol === "https:") {
            chrome.storage.sync.get(["hideImages", "whitelist"], (data) => {
                const isWhitelisted = data.whitelist.includes(url.hostname);

                if (data.hideImages && !isWhitelisted) {
                    chrome.tabs.executeScript(tabId, {
                        code: 'document.querySelectorAll("img").forEach(img => img.style.display = "none");'
                    }).catch(err => console.warn("Ошибка выполнения content.js:", err));
                }
            });
        }
    }
});
