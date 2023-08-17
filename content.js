let selection = "";

function onMouseUp(event) {
  if (event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const top = rect.top + window.pageYOffset - 45;
    const left = rect.left + window.pageXOffset - 10;
    chrome.runtime.sendMessage({ action: "highlight" }, function(response) {
      selection = response.selection;
      if (selection) {
        const popup = document.createElement("div");
        popup.style.position = "absolute";
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
        popup.style.width = "300px";
        popup.style.padding = "10px";
        popup.style.background = "#fff";
        popup.style.border = "1px solid #ccc";
        popup.style.borderRadius = "3px";
        popup.style.boxShadow = "3px 3px 5px rgba(0, 0, 0, 0.2)";
        popup.style.zIndex = "999999";
        popup.innerHTML = `
          <h1>Text Assistant</h1>
          <p><strong>${selection}</strong></p>
          <input type="text" placeholder="Enter a question...">
          <p style="text-align: right;"><small>Press Enter to submit</small></p>
        `;
        document.body.appendChild(popup);
        const input = popup.querySelector("input");
        input.focus();
        input.addEventListener("keydown", onInputKeyDown);
      }
    });
  }
}

function onInputKeyDown(event) {
  if (event.key === "Enter") {
    const query = event.target.value.trim();
    chrome.runtime.sendMessage({ action: "query", query: query }, function(response) {
      const popup = document.querySelector("div");
      const text = response.text;
      popup.innerHTML += `<p>${text}</p>`;
      const input = popup.querySelector("input");
      input.value = "";
      input.removeEventListener("keydown", onInputKeyDown);
      input.focus();
    });
  }
}

document.addEventListener("mouseup", onMouseUp);
