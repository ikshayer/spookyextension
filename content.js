(async function () {
  if (window.__haunted_injected) return;
  window.__haunted_injected = true;

  // --- Configuration ---
  const imageFolder = "public/images/";
  const audioFolder = "public/audio/";

  const shadowImages = [
    "gabriel.webp",
    "gabriel2.webp",
    "gabriel3.webp",
    "tvguy.jpg",
    "sayori.webp"
  ];
  const staticImages = ["glitch2.jpg"];
  const flashImages = [
    "gabriel.webp",
    "gabriel2.webp",
    "gabriel3.webp",
    "tvguy.jpg",
    "sayori.webp",
  ];
  const audioTracks = [
    "carpass.mp3",
    "clock.mp3",
    "drone.mp3",
    "footstep1.mp3",
    "footstep2.mp3",
    "moan.mp3",
    "whisper.mp3",
  ];

  // Disturbing text replacements
  const creepyPhrases = [
    "HELP ME",
    "BEHIND YOU",
    "IT SEES YOU",
    "DON'T LOOK",
    "RUN",
    "THEY'RE HERE",
    "NO ESCAPE",
    "WATCHING",
  ];

  // Pick random ambient assets
  const shadowImg = shadowImages[Math.floor(Math.random() * shadowImages.length)];
  const staticImg = staticImages[Math.floor(Math.random() * staticImages.length)];

  // --- Intensity System ---
  let hauntLevel = 0; // 0-10 scale
  let timeElapsed = 0;
  let lastIntenseEvent = 0;

  setInterval(() => {
    timeElapsed++;
    // Gradually increase intensity over 3 minutes (every 18 seconds = 1 level)
    hauntLevel = Math.min(10, Math.floor(timeElapsed / 18));
    console.log(`Haunt Level: ${hauntLevel}/10 | Time: ${timeElapsed}s`);
    updateAmbientIntensity();
  }, 1000);

  // --- Styles ---
  const style = document.createElement("style");
  style.id = "haunted-style";
  style.textContent = `
  #haunted-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483646;
    mix-blend-mode: normal;
    overflow: hidden;
  }
  .fog {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%);
    opacity: 0;
    animation: drift 60s linear infinite;
    filter: blur(6px);
    transition: opacity 2s ease;
  }
  .shadow {
    position: absolute; inset: 0;
    background-size: cover;
    opacity: 0;
    animation: floatShadow 18s ease-in-out infinite;
    transition: opacity 2s ease;
  }
  .vignette {
    position:absolute; inset:0;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%);
    mix-blend-mode: multiply;
    opacity: 0;
    transition: opacity 2s ease;
  }
  .flicker {
    position:absolute; inset:0;
    background: linear-gradient(180deg, rgba(255,0,0,0.02), rgba(0,0,0,0.0));
    mix-blend-mode: overlay;
    animation: flicker 7s steps(6, end) infinite;
    opacity: 0;
    transition: opacity 2s ease;
  }
  .static {
    position:absolute; inset:0;
    background-image: url(${chrome.runtime.getURL(imageFolder + staticImg)});
    background-size: cover;
    mix-blend-mode: screen;
    opacity: 0.6;
    animation: staticNoise 0.6s steps(8,end) infinite;
    display: none;
  }
  .flash {
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 2147483647;
  }
  #haunted-silhouette {
    position: fixed;
    width: 220px;
    height: 220px;
    right: -250px;
    bottom: 10%;
    background: url(${chrome.runtime.getURL("gabriel.webp")}) no-repeat center/contain;
    opacity: 0;
    filter: blur(1px);
    transform: scaleX(-1);
    z-index: 2147483647;
    pointer-events:none;
    transition: transform 2.6s ease, opacity 1.8s ease, right 2.6s ease;
  }
  .screen-tear {
    position: fixed;
    inset: 0;
    background: black;
    z-index: 2147483647;
    pointer-events: none;
    opacity: 0;
  }
  .fake-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    opacity: 0;
    z-index: 2147483647;
    pointer-events: none;
    box-shadow: 0 0 20px red;
  }
  .creepy-text {
    position: fixed;
    font-family: 'Courier New', monospace;
    font-size: 18px;
    color: rgba(255, 0, 0, 0.7);
    z-index: 2147483647;
    pointer-events: none;
    animation: fadeInOut 3s ease;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
  }
  .breathing-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483645;
    transform-origin: center;
  }
  .eye-follower {
    position: fixed;
    width: 60px;
    height: 30px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 50%;
    z-index: 2147483647;
    pointer-events: none;
    opacity: 0;
    transition: opacity 2s ease;
  }
  .eye-pupil {
    position: absolute;
    width: 12px;
    height: 12px;
    background: rgba(255, 0, 0, 0.4);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.3s ease;
  }
  .fake-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 2147483647;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 300px;
  }
  .fake-notification-title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 14px;
  }
  .fake-notification-body {
    font-size: 13px;
    color: #555;
  }

  @keyframes drift {
    from { transform: translateX(-10%); }
    to { transform: translateX(10%); }
  }
  @keyframes floatShadow {
    0% { transform: translateY(-3%); opacity:0.05; }
    50% { transform: translateY(3%); opacity:0.09; }
    100% { transform: translateY(-3%); opacity:0.05; }
  }
  @keyframes flicker {
    0% { opacity: 0.02; }
    10% { opacity: 0.12; }
    12% { opacity: 0.02; }
    35% { opacity: 0.06; }
    100% { opacity: 0.02; }
  }
  @keyframes staticNoise {
    0%, 100% { opacity: 0.04; }
    50% { opacity: 0.09; }
  }
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(20px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
  @keyframes breathe {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  html, body { transition: transform 0.1s ease, filter 0.3s ease; }
  `;
  document.head.appendChild(style);

  // --- Overlay structure ---
  const ov = document.createElement("div");
  ov.id = "haunted-overlay";
  ov.innerHTML = `
    <div class="fog"></div>
    <div class="vignette"></div>
    <div class="shadow"></div>
    <div class="flicker"></div>
    <div class="static"></div>
  `;
  document.documentElement.appendChild(ov);

  const silhouette = document.createElement("div");
  silhouette.id = "haunted-silhouette";
  document.documentElement.appendChild(silhouette);

  const staticLayer = ov.querySelector(".static");
  const fogLayer = ov.querySelector(".fog");
  const shadowLayer = ov.querySelector(".shadow");
  const vignetteLayer = ov.querySelector(".vignette");
  const flickerLayer = ov.querySelector(".flicker");

  // Breathing overlay
  const breathingOverlay = document.createElement("div");
  breathingOverlay.className = "breathing-overlay";
  document.documentElement.appendChild(breathingOverlay);

  // --- Update ambient intensity based on haunt level ---
  function updateAmbientIntensity() {
    const level = hauntLevel / 10;
    
    // Gradually introduce ambient effects as haunt level increases
    if (hauntLevel >= 2) {
      fogLayer.style.opacity = String((level - 0.2) * 0.15);
    }
    if (hauntLevel >= 3) {
      shadowLayer.style.opacity = String((level - 0.3) * 0.12);
    }
    if (hauntLevel >= 4) {
      vignetteLayer.style.opacity = String((level - 0.4) * 0.8);
    }
    if (hauntLevel >= 5) {
      flickerLayer.style.opacity = String((level - 0.5) * 0.1);
    }
  }

  // --- Random creepy sound (plays once then stops) ---
  async function playRandomCreepySound() {
    const randomSound = audioTracks[Math.floor(Math.random() * audioTracks.length)];
    const tempAudio = new Audio(chrome.runtime.getURL(audioFolder + randomSound));
    tempAudio.volume = 0.3 + Math.random() * 0.4 + (hauntLevel * 0.03);
    try { 
      await tempAudio.play();
      // Let it play for 3-6 seconds then fade out
      const playDuration = 3000 + Math.random() * 3000;
      setTimeout(() => {
        const fadeOut = setInterval(() => {
          if (tempAudio.volume > 0.05) {
            tempAudio.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
            tempAudio.pause();
          }
        }, 100);
      }, playDuration);
    } catch {}
  }

  // --- Glitch burst ---
  function triggerGlitch() {
    const intensity = 1 + (hauntLevel * 0.2);
    staticLayer.style.display = "block";
    staticLayer.style.opacity = String(0.6 + (hauntLevel * 0.1));
    document.body.style.filter = `contrast(${1.5 * intensity}) brightness(${1.2 * intensity})`;
    jitterCamera();
    
    const duration = 500 + Math.random() * 800;
    setTimeout(() => {
      staticLayer.style.display = "none";
      document.body.style.filter = "";
    }, duration);
  }

  // --- Full-screen flash ---
  function triggerFlash() {
    const flashImg = flashImages[Math.floor(Math.random() * flashImages.length)];
    const flash = document.createElement("div");
    flash.className = "flash";
    flash.style.backgroundImage = `url(${chrome.runtime.getURL(imageFolder + flashImg)})`;
    document.body.appendChild(flash);
    requestAnimationFrame(() => { 
      flash.style.opacity = String(0.7 + (hauntLevel * 0.03)); 
    });
    
    const duration = 150 + Math.random() * 300 - (hauntLevel * 20);
    setTimeout(() => { flash.style.opacity = "0"; }, duration);
    setTimeout(() => flash.remove(), 800);
    
    // Play sound with flash for extra scare
    playRandomCreepySound();
  }

  // --- Camera jitter ---
  function jitterCamera() {
    const intensity = 1 + Math.random() * 1.5 + (hauntLevel * 0.5);
    const x = (Math.random() - 0.5) * intensity;
    const y = (Math.random() - 0.5) * intensity;
    document.documentElement.style.transform = `translate(${x}px, ${y}px) rotate(${(Math.random() - 0.5) * 0.3}deg)`;
    requestAnimationFrame(() => {
      document.documentElement.style.transform = "";
    });
  }

  // --- Screen tear effect ---
  function triggerScreenTear() {
    const tear = document.createElement("div");
    tear.className = "screen-tear";
    document.body.appendChild(tear);
    
    const splitAt = Math.random() * 100;
    tear.style.clipPath = `inset(${splitAt}% 0 0 0)`;
    tear.style.opacity = "1";
    
    const offset = 20 + Math.random() * 80;
    document.documentElement.style.clipPath = `inset(0 0 ${100 - splitAt}% 0)`;
    document.documentElement.style.transform = `translateX(${offset}px)`;
    
    setTimeout(() => {
      tear.style.opacity = "0";
      document.documentElement.style.clipPath = "";
      document.documentElement.style.transform = "";
      setTimeout(() => tear.remove(), 300);
    }, 200 + Math.random() * 300);
  }

  // --- Color inversion ---
  function triggerInversion() {
    document.body.style.filter = "invert(1) hue-rotate(180deg)";
    setTimeout(() => {
      document.body.style.filter = "";
    }, 300 + Math.random() * 700);
  }

  // --- Text corruption ---
  function corruptText() {
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim().length > 20 && 
          node.parentElement.tagName !== 'SCRIPT' && 
          node.parentElement.tagName !== 'STYLE') {
        textNodes.push(node);
      }
    }
    
    if (textNodes.length === 0) return;
    
    const targetNode = textNodes[Math.floor(Math.random() * textNodes.length)];
    const originalText = targetNode.textContent;
    const words = originalText.split(' ');
    
    if (words.length > 3) {
      const randomIndex = Math.floor(Math.random() * (words.length - 1));
      const phrase = creepyPhrases[Math.floor(Math.random() * creepyPhrases.length)];
      words[randomIndex] = phrase;
      targetNode.textContent = words.join(' ');
      
      setTimeout(() => {
        targetNode.textContent = originalText;
      }, 2000 + Math.random() * 3000);
    }
  }

  // --- Creepy floating text ---
  function showCreepyText() {
    const text = document.createElement("div");
    text.className = "creepy-text";
    text.textContent = creepyPhrases[Math.floor(Math.random() * creepyPhrases.length)];
    text.style.left = `${Math.random() * 80 + 10}%`;
    text.style.top = `${Math.random() * 80 + 10}%`;
    document.body.appendChild(text);
    
    setTimeout(() => text.remove(), 3000);
  }

  // --- Cursor interference ---
  function interfereCursor() {
    const fakeCursor = document.createElement("div");
    fakeCursor.className = "fake-cursor";
    document.body.appendChild(fakeCursor);
    
    let count = 0;
    const interval = setInterval(() => {
      fakeCursor.style.left = `${Math.random() * window.innerWidth}px`;
      fakeCursor.style.top = `${Math.random() * window.innerHeight}px`;
      fakeCursor.style.opacity = "0.6";
      count++;
      if (count > 5 + hauntLevel) {
        clearInterval(interval);
        fakeCursor.style.opacity = "0";
        setTimeout(() => fakeCursor.remove(), 300);
      }
    }, 200);
  }

  // --- Breathing effect ---
  function triggerBreathing() {
    breathingOverlay.style.animation = "breathe 4s ease-in-out";
    document.body.style.animation = "breathe 4s ease-in-out";
    
    setTimeout(() => {
      breathingOverlay.style.animation = "";
      document.body.style.animation = "";
    }, 4000);
  }

  // --- Eye follower ---
  let eyesVisible = false;
  function createEyeFollower() {
    if (eyesVisible || hauntLevel < 3) return;
    
    const leftEye = document.createElement("div");
    leftEye.className = "eye-follower";
    leftEye.style.left = "20px";
    leftEye.style.top = "50%";
    leftEye.innerHTML = '<div class="eye-pupil"></div>';
    
    const rightEye = document.createElement("div");
    rightEye.className = "eye-follower";
    rightEye.style.left = "90px";
    rightEye.style.top = "50%";
    rightEye.innerHTML = '<div class="eye-pupil"></div>';
    
    document.body.appendChild(leftEye);
    document.body.appendChild(rightEye);
    
    setTimeout(() => {
      leftEye.style.opacity = "1";
      rightEye.style.opacity = "1";
    }, 100);
    
    eyesVisible = true;
    
    const leftPupil = leftEye.querySelector(".eye-pupil");
    const rightPupil = rightEye.querySelector(".eye-pupil");
    
    function updateEyes(e) {
      const leftRect = leftEye.getBoundingClientRect();
      const rightRect = rightEye.getBoundingClientRect();
      
      const leftAngle = Math.atan2(
        e.clientY - (leftRect.top + leftRect.height / 2),
        e.clientX - (leftRect.left + leftRect.width / 2)
      );
      const rightAngle = Math.atan2(
        e.clientY - (rightRect.top + rightRect.height / 2),
        e.clientX - (rightRect.left + rightRect.width / 2)
      );
      
      const distance = 8;
      leftPupil.style.transform = `translate(calc(-50% + ${Math.cos(leftAngle) * distance}px), calc(-50% + ${Math.sin(leftAngle) * distance}px))`;
      rightPupil.style.transform = `translate(calc(-50% + ${Math.cos(rightAngle) * distance}px), calc(-50% + ${Math.sin(rightAngle) * distance}px))`;
    }
    
    document.addEventListener("mousemove", updateEyes);
    
    setTimeout(() => {
      leftEye.style.opacity = "0";
      rightEye.style.opacity = "0";
      setTimeout(() => {
        document.removeEventListener("mousemove", updateEyes);
        leftEye.remove();
        rightEye.remove();
        eyesVisible = false;
      }, 2000);
    }, 10000 + Math.random() * 10000);
  }

  // --- Fake notification ---
  function showFakeNotification() {
    const messages = [
      { title: "System Warning", body: "Unusual activity detected" },
      { title: "Browser Alert", body: "Someone is watching your screen" },
      { title: "Security Notice", body: "Your connection is being monitored" },
      { title: "Error", body: "Failed to stop unknown process" },
      { title: "Chrome", body: "This page is trying to access your camera" },
    ];
    
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const notification = document.createElement("div");
    notification.className = "fake-notification";
    notification.innerHTML = `
      <div class="fake-notification-title">${msg.title}</div>
      <div class="fake-notification-body">${msg.body}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.opacity = "1", 100);
    setTimeout(() => notification.style.opacity = "0", 4000);
    setTimeout(() => notification.remove(), 4500);
  }

  // --- Scroll interference ---
  function interfereScroll() {
    let scrollBlocked = true;
    const originalScroll = window.scrollY;
    
    function blockScroll(e) {
      if (scrollBlocked) {
        e.preventDefault();
        window.scrollTo(0, originalScroll);
      }
    }
    
    window.addEventListener("scroll", blockScroll, { passive: false });
    window.addEventListener("wheel", blockScroll, { passive: false });
    
    setTimeout(() => {
      scrollBlocked = false;
      window.removeEventListener("scroll", blockScroll);
      window.removeEventListener("wheel", blockScroll);
    }, 1000 + Math.random() * 2000);
  }

  // --- Silhouette motion ---
  let silhouetteTimer = null;
  function moveSilhouette() {
    if (silhouetteTimer) clearTimeout(silhouetteTimer);
    
    if (hauntLevel >= 2) {
      silhouette.style.opacity = String(0.02 + Math.random() * 0.06 + (hauntLevel * 0.01));
      const x = -120 + Math.random() * 20 + (hauntLevel * 10);
      const y = 5 + Math.random() * 60;
      silhouette.style.right = `${x}px`;
      silhouette.style.bottom = `${y}%`;
    }
    
    const nextMove = 4000 + Math.random() * 8000 - (hauntLevel * 400);
    silhouetteTimer = setTimeout(moveSilhouette, nextMove);
  }
  moveSilhouette();

  // --- Intense moment (multiple effects at once) ---
  function triggerIntenseMoment() {
    if (hauntLevel < 4) return;
    
    const now = Date.now();
    if (now - lastIntenseEvent < 20000) return; // Shorter cooldown for demo
    lastIntenseEvent = now;
    
    triggerGlitch();
    setTimeout(() => triggerFlash(), 500);
    setTimeout(() => showCreepyText(), 800);
    setTimeout(() => jitterCamera(), 1200);
    setTimeout(() => triggerInversion(), 1500);
    setTimeout(() => playRandomCreepySound(), 2000);
  }

  // --- Randomized haunt timing with intensity scaling ---
  function scheduleEvent(eventFunc, baseMin, baseMax, levelScale = 1) {
    const scaleFactor = Math.max(0.3, 1 - (hauntLevel * 0.07 * levelScale));
    const min = baseMin * scaleFactor;
    const max = baseMax * scaleFactor;
    const delay = min + Math.random() * (max - min);
    
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% chance to trigger
        eventFunc();
      }
      scheduleEvent(eventFunc, baseMin, baseMax, levelScale);
    }, delay);
  }

  // Schedule all events with increasing frequency (DEMO MODE - faster, stealth start)
  scheduleEvent(triggerGlitch, 15000, 30000, 1.5);
  scheduleEvent(playRandomCreepySound, 20000, 40000, 1.2);
  scheduleEvent(triggerFlash, 10000, 25000, 1.3);
  scheduleEvent(triggerScreenTear, 15000, 35000, 1);
  scheduleEvent(triggerInversion, 20000, 45000, 0.8);
  scheduleEvent(corruptText, 8000, 15000, 1);
  scheduleEvent(showCreepyText, 10000, 22000, 1.2);
  scheduleEvent(interfereCursor, 15000, 35000, 0.9);
  scheduleEvent(triggerBreathing, 20000, 40000, 0.7);
  scheduleEvent(createEyeFollower, 25000, 50000, 0.5);
  scheduleEvent(showFakeNotification, 18000, 38000, 0.8);
  scheduleEvent(interfereScroll, 15000, 35000, 0.9);
  scheduleEvent(triggerIntenseMoment, 30000, 60000, 0.3);
})();