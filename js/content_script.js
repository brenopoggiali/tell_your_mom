function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}
injectScript(chrome.extension.getURL("js/inject.js"), "body");

chrome.runtime.onMessage.addListener(function(request) {
  window.postMessage({ ...request }, "https://web.whatsapp.com");
});
