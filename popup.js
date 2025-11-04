const toggle = document.getElementById("toggle");
const volume = document.getElementById("volume");
const effectsBtn = document.getElementById("effectsBtn");

async function setState(enabled) {
  await chrome.storage.local.set({ haunted_enabled: enabled });
  toggle.checked = enabled;
  effectsBtn.className = enabled ? "on" : "off";
  effectsBtn.textContent = enabled ? "Apply to open tabs" : "Apply to open tabs";
}

async function init() {
  const s = await chrome.storage.local.get(["haunted_enabled", "haunted_volume"]);
  const enabled = !!s.haunted_enabled;
  const vol = (s.haunted_volume ?? 20);
  toggle.checked = enabled;
  volume.value = vol;
  setState(enabled);
}

toggle.addEventListener("change", async () => {
  const enabled = toggle.checked;
  await chrome.storage.local.set({ haunted_enabled: enabled });
  // Ask scripting to re-check and apply on the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.__haunted_force_update && window.__haunted_force_update()
    }).catch(()=>{/* ignore errors on pages that block scripts */});
  }
  setState(enabled);
});

volume.addEventListener("input", async () => {
  const v = Number(volume.value);
  await chrome.storage.local.set({ haunted_volume: v });
  // tell active tab to update volume
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.__haunted_update_volume && window.__haunted_update_volume()
    }).catch(()=>{/* ignore */});
  }
});

effectsBtn.addEventListener("click", async () => {
  // run a small script to toggle/apply overlay on all visible tabs
  const tabs = await chrome.tabs.query({ currentWindow: true });
  for (const t of tabs) {
    chrome.scripting.executeScript({
      target: { tabId: t.id },
      func: () => window.__haunted_force_update && window.__haunted_force_update()
    }).catch(()=>{/* ignore */});
  }
});

init();
