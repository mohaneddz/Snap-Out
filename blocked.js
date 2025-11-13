// Overlay setup
const overlay = document.createElement("div");
overlay.style.cssText = `
  position:fixed;top:0;left:0;width:100%;height:100%;
  display:flex;flex-direction:column;justify-content:center;align-items:center;
  background:white;font-family:sans-serif;z-index:9999;
`;

const prompt = document.createElement("p");
prompt.innerText = "Why are you visiting this website now?";
overlay.appendChild(prompt);

const input = document.createElement("textarea");
input.style.width="300px"; input.style.height="100px";
overlay.appendChild(input);

const btn = document.createElement("button");
btn.innerText="Submit";
overlay.appendChild(btn);

btn.onclick = () => {
  if(input.value.trim()==="") { alert("Enter a reason!"); return; }
  chrome.runtime.sendMessage({action:"logVisit", url:window.location.href, reason: input.value}, ()=> {
    // Since redirected, perhaps close or redirect back; for simplicity, alert success
    alert("Logged. You can now access the site.");
    window.close(); // Or handle as needed
  });
};

document.body.appendChild(overlay);
