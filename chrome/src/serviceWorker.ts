/* This is action when user clicks on Chrome Extension Icon */

let ceTabId = 0;
let myWindow: any;
let parentTabGlobal: any;
let ceSize = 430;

/**
 * @param parentTab A Tab on which user clicked on Open Extension.
 * @param height 
 * @param width 
 */

function openChildPopup(parentTab: any, height: any, width: any) {
  if (myWindow) {
    chrome.windows.update(parentTab.windowId, { focused: true, top: 0, left: 0, width: width });
    chrome.windows.remove(myWindow.id, () => { myWindow = null });
  } else {
    parentTabGlobal = parentTab;
    chrome.windows.create({
      focused: true,
      height: height,
      width: ceSize,
      url: 'index.html?#popup',
      type: 'popup'
    }, (newCePopUpWindow: any) => {
      myWindow = newCePopUpWindow;
      chrome.storage.sync.set({ myWindow: newCePopUpWindow });

      if (newCePopUpWindow && newCePopUpWindow.tabs) {
        ceTabId = newCePopUpWindow.tabs[0].id
      }

      chrome.windows.update(parentTab.windowId, {
        focused: false,
        top: 0,
        width: width - ceSize,
        left: ceSize
      });

      // Here parentTab is Tab from which extension where got opened.
      chrome.storage.sync.set({ parentTab: parentTab.id });
      chrome.tabs.reload(parentTab.id);
    })
  }
}

// When ever the Parent window url gets any changes, this event is fired.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, currentTab) {
  if (tabId && currentTab.status == "complete"
    && changeInfo.status == 'complete' && currentTab.url != undefined && !(currentTab.url.includes('savedSearchId')
      && (currentTab.url.includes('sessionId') || currentTab.url.includes('searchSessionId')))) {
    let parentTabId: any = parentTabGlobal ? parentTabGlobal.id : null;
    if (tabId === parentTabId) {
      setTimeout(function () {
        chrome.tabs.reload(ceTabId), 4000
      });
    } else {
      console.log('Error Case');
    }
  }
});

chrome.action.onClicked.addListener((tab: any) => {
  chrome.cookies.get({ url: 'https://www.linkedin.com/', name: 'JSESSIONID' }, function (cookie) {
    // Get Device screen dimensions.
    if (tab.url.includes('linkedin')) {
      chrome.system.display.getInfo((screenInfo) => {
        let screenHeight = screenInfo[0].bounds.height;
        let screenWidth = screenInfo[0].bounds.width;
        chrome.windows.getCurrent((window) => {
          chrome.storage.sync.set({ sessionId: (cookie || {}).value });
          openChildPopup(tab, screenHeight, screenWidth);
        })
      });
    }
  });
}) 
