const rule = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: "web.whatsapp.com" }
    })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([rule]);
  });
  chrome.storage.sync.get(
    ["momName", "timeToSend", "msgToSend", "isOn"],
    ({ momName, timeToSend, msgToSend, isOn }) => {
      const mStorage = {
        momName: momName || "Dilminha",
        timeToSend: timeToSend || "00:00",
        msgToSend: msgToSend || "Olá Mãe, cheguei do serviço",
        isOn: isOn || true
      };
      chrome.storage.sync.set(mStorage);
    }
  );
});

chrome.tabs.onActivated.addListener(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.storage.sync.get(
      ["momName", "timeToSend", "msgToSend", "isOn"],
      items => {
        chrome.tabs.sendMessage(tabs[0].id, items);
      }
    );
  });
});
