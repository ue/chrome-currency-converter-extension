function onPageDetailsReceived(details) {
  document.getElementById('output').innerText = details.summary;
}
window.addEventListener('load', function(evt) {
  chrome.runtime.getBackgroundPage(function(eventPage) {
    eventPage.getPageDetails(onPageDetailsReceived);
  });
});
