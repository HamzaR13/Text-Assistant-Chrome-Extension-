function onRequest(request, sender, sendResponse) {
    if (request.action === "highlight") {
      chrome.tabs.executeScript({
        code: "window.getSelection().toString();",
        allFrames: true,
        frameId: sender.frameId
      }, function(selection) {
        sendResponse({ selection: selection[0] });
      });
      return true;
    } else if (request.action === "query") {
      const query = encodeURIComponent(request.query);
      const apiKey = "<YOUR_API_KEY>";
      const apiUrl = `https://api.openai.com/v1/engines/davinci-codex/completions?prompt=${query}&max_tokens=100&n=1&stop=`;
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({})
      })
        .then(response => response.json())
        .then(data => {
          const text = data.choices[0].text.trim();
          sendResponse({ text: text });
        })
        .catch(error => {
          console.error(error);
          sendResponse({ text: "Sorry, an error occurred." });
        });
      return true;
    }
  }
  
  chrome.runtime.onMessage.addListener(onRequest);
  