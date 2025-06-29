chrome.action.onClicked.addListener((tab) => {
    if (tab.id !== undefined) {
        chrome.tabs.sendMessage(tab.id, { type: "show_xpath_selector" });
    }
})