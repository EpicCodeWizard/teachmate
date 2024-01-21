const processEvent = (mutationList, observer) => {
    for (const atag of document.getElementsByTagName("a")) {
      if (atag.href.indexOf("clerk.com") > -1) {
        atag.parentElement.remove();
      }
    }
  };
  
new MutationObserver(processEvent).observe(document, {childList: true, subtree: true});