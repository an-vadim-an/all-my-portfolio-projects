document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggleHideImages");
    const whitelistInput = document.getElementById("whitelistInput");
    const whitelistList = document.getElementById("whitelist");


    toggle.classList.add("no-animation");


    chrome.storage.sync.get(["hideImages", "whitelist"], (data) => {
        toggle.checked = data.hideImages;
        updateWhitelistUI(data.whitelist || []);


        setTimeout(() => {
            toggle.classList.remove("no-animation");
        }, 10);
    });


    toggle.addEventListener("change", () => {
        chrome.storage.sync.set({ hideImages: toggle.checked });
    });


    whitelistInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const url = new URL(whitelistInput.value);
            const hostname = url.hostname;


            chrome.storage.sync.get("whitelist", (data) => {
                const whitelist = data.whitelist || [];
                if (!whitelist.includes(hostname)) {
                    whitelist.push(hostname);
                    chrome.storage.sync.set({ whitelist }, () => {
                        updateWhitelistUI(whitelist);
                    });
                }
            });


            whitelistInput.value = "";
        }
    });


    function updateWhitelistUI(whitelist) {
        whitelistList.innerHTML = "";
        whitelist.forEach(site => {
            const li = document.createElement("li");
            li.textContent = site;
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Удалить";
            removeBtn.onclick = () => removeFromWhitelist(site);
            li.appendChild(removeBtn);
            whitelistList.appendChild(li);
        });
    }


    function removeFromWhitelist(site) {
        chrome.storage.sync.get("whitelist", (data) => {
            const whitelist = data.whitelist.filter(item => item !== site);
            chrome.storage.sync.set({ whitelist }, () => {
                updateWhitelistUI(whitelist);
            });
        });
    }
});
