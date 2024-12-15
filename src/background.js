// ff-proxy-toggle
//
// An Opensource Proxy Toggle that does not muck with your data.
// BSD-3 clause. See LICENSE

// Update the UI to display the correct icon and
// tooltip.
// 'true' means proxy is enabled
// 'false' means proxy is not enabled.
let updateUI = function(enabled) {
  if (enabled) {
    browser.action.setIcon({
      path: "icon.png"
    });
    browser.action.setTitle({title: "Disable Manual Proxy"});
  } else {
    browser.action.setIcon({
      path: "icon-disabled.png"
    });
    browser.action.setTitle({title: "Enable Manual Proxy"});
  }
}

// Check if the extension has incognition permission
// if not display a warning. If it does have the
// permission calls the callback.
let runCallbackIfIncognitoPermissionGrantedWarnOtherwise = function(callback) {
  let isAllowedPromise = browser.extension.isAllowedIncognitoAccess();
  isAllowedPromise.then((isAllowed) => {
    if (!isAllowed) {
      browser.windows.create({
        url: "warning.html",
        type: "popup",
        width: 500,
        height: 600
      });
    } else {
      callback();
    }
  });
  return false;
}

// Toggle the proxy state.
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

// Load the state on plugin startup.
let startup = function() {
  browser.proxy.settings.get({}, (proxySettings) => {
    console.log("FF Proxy Startup Settings: ", proxySettings.value.proxyType);
    if (proxySettings.value.proxyType == "none") {
      updateUI(false);
    } else {
      updateUI(true);
    }
  });
}

setTimeout(() => {
  startup();
}, 100);

// Respond to button clicks on the icon
browser.action.onClicked.addListener(() => {
    runCallbackIfIncognitoPermissionGrantedWarnOtherwise( () => {
      toggleProxy();
    });
  });
