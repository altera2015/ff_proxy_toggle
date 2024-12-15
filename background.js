let updateUI = function(enabled) {
  if (enabled) {
    browser.browserAction.setIcon({
      path: "icon.png"
    });
    browser.browserAction.setTitle({title: "Disable Manual Proxy"});
  } else {
    browser.browserAction.setIcon({
      path: "icon-disabled.png"
    });
    browser.browserAction.setTitle({title: "Enable Manual Proxy"});
  }
}

let runCallbackIfIncognitoPermissionGrantedWarnOtherwise = function(callback) {
  let isAllowedPromise = browser.extension.isAllowedIncognitoAccess();
  isAllowedPromise.then((isAllowed) => {
    if (!isAllowed) {
      browser.windows.create({
        url: "warning.html",
        type: "popup",
        width: 400,
        height: 400
      });
    } else {
      callback();
    }
  });
  return false;
}

let toggleProxy = function() {
  browser.proxy.settings.get({}, (proxySettings) => {
    if (proxySettings.value.proxyType == "manual") {
      console.log("disabling proxy");
      proxySettings.value.proxyType = "none";
      state = false;
    } else {
      console.log("enabling proxy");
      proxySettings.value.proxyType = "manual";
      state = true;
    }
    browser.proxy.settings.set({value:proxySettings.value});
    updateUI(state);
  });
}

browser.proxy.settings.get({}, (proxySettings) => {
  if (proxySettings.value.proxyType == "none") {
    updateUI(false);
  } else {
    updateUI(true);
  }
});

browser.browserAction.onClicked.addListener(() => {
    runCallbackIfIncognitoPermissionGrantedWarnOtherwise( () => {
      toggleProxy();
    });
  });