var selection = window.getSelection();
var range = selection.getRangeAt(0);
var currencyValue;

if (range) {
  var div = document.createElement('div');
  div.appendChild(range.cloneContents());
  selectedText = div.innerHTML;
}

if (selectedText.length > 1 && selectedText.includes('$') ||
    selectedText.includes('₺') ||
    selectedText.includes('TL')) {
    var result = decideCalculate(selectedText);

    chrome.runtime.sendMessage({
      title: document.title,
      url: window.location.href,
      summary: result !== 'NaN$' ? result : 'Oops!',
    });

} else {
    chrome.runtime.sendMessage({
      summary: "Please select...",
  });
}

function seperateSelectedText(selectedText) {
  var isBlock = selectedText.includes('<');
  var seperateFromMoneyIcon = selectedText.split('$');
  return isBlock ? seperateFromMoneyIcon[1].split('</')[0] : seperateFromMoneyIcon[1];
}

function decideCalculate(selectedText) {
  var pureSelectedCurrenct = seperateSelectedText(selectedText);
  var _currencyValue = getCurrencyValueFromApi();
  var res;

  if(selectedText.includes('$')) {
    return (_currencyValue * pureSelectedCurrenct).toFixed(2) + '$';
  } else if (selectedText.includes('TL') || selectedText.includes('₺')) {
    return (pureSelectedCurrenct / _currencyValue).toFixed(2) + '₺';
  }
}

function getCurrencyValueFromApi() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'https://free.currencyconverterapi.com/api/v5/convert?q=USD_TRY&compact=y', true);

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
          if(xmlhttp.status == 200) {
              value =  JSON.parse(xmlhttp.responseText).USD_TRY.val;
          }
      }
    };

  xmlhttp.send(null);
  return value;
}