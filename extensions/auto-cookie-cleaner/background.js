chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.get(['mode'], ({ mode }) => {
    if (mode === 'off') return;

    chrome.sessions.getRecentlyClosed({ maxResults: 1 }, (sessions) => {
      const url = sessions[0]?.tab?.url;
      if (!url) return;

      const domain = new URL(url).hostname;

      chrome.cookies.getAll({ domain }, (cookies) => {
        if (!cookies.length) return;

        const deleteCookie = (cookie) => {
          const protocol = cookie.secure ? "https:" : "http:";
          const url = `${protocol}//${cookie.domain}${cookie.path}`;
          chrome.cookies.remove({ url, name: cookie.name });
        };

        chrome.storage.local.get(['excludeList'], ({ excludeList }) => {
          cookies.forEach(cookie => {
            const isExcluded = excludeList?.some(domain => cookie.domain.includes(domain));
            if (!isExcluded) {
              deleteCookie(cookie);
              updateCounter(1);
            }
          });
        });

        if (mode === 'all') {
          chrome.cookies.getAll({}, (allCookies) => {
            allCookies.forEach(deleteCookie);
            updateCounter(allCookies.length);
          });
        }
      });
    });
  });
});

function updateCounter(count) {
  chrome.storage.local.get(['deletedCount'], (data) => {
    const current = data.deletedCount || 0;
    chrome.storage.local.set({ deletedCount: current + count });
  });
}
