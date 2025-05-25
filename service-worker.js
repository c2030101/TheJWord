// Path to the offscreen document
const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// A global promise to avoid race conditions when creating the offscreen document
let creatingOffscreenDocumentPromise;

// Function to ensure an offscreen document is active
async function ensureOffscreenDocument() {
  // Check if an offscreen document is already available.
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT]
  });
  if (existingContexts.length > 0) {
    return;
  }

  // If a creation process is already underway, wait for it to complete.
  if (creatingOffscreenDocumentPromise) {
    await creatingOffscreenDocumentPromise;
  } else {
    creatingOffscreenDocumentPromise = chrome.offscreen.createDocument({
      url: chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH),
      reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
      justification: 'To play notification sounds when a site is blocked.',
    });
    try {
      await creatingOffscreenDocumentPromise;
    } finally {
      creatingOffscreenDocumentPromise = null; // Clear the promise once resolved/rejected
    }
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'playSoundEffect') {
    console.log('Service Worker: Received playSoundEffect message');
    await ensureOffscreenDocument();
    
    const audioUrl = chrome.runtime.getURL('assets/block-sound.mp3');
    console.log(`Service Worker: Attempting to play sound from ${audioUrl}`);
    
    try {
      // Send a message to the offscreen document to play the sound.
      // This message will be caught by the listener in offscreen.js
      await chrome.runtime.sendMessage({
        command: 'playSound',
        sourceUrl: audioUrl
      });
      console.log("Service Worker: Sent 'playSound' command to offscreen document.");
    } catch (error) {
      console.error("Service Worker: Error sending message to offscreen document:", error);
    }
  }
});

console.log("Service worker started and listeners registered."); 