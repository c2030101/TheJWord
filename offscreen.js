chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'playSound' && message.sourceUrl) {
    const audio = document.getElementById('soundEffect');
    if (!audio) {
      console.error('Offscreen audio: Audio element #soundEffect not found.');
      sendResponse({ success: false, error: 'Audio element not found' });
      return false; // Or simply don't return true if handling synchronously like this
    }
    audio.src = message.sourceUrl;
    audio.play()
      .then(() => {
        console.log('Offscreen audio: Sound played successfully.');
        sendResponse({ success: true, message: 'Playback started' });
      })
      .catch(e => {
        console.error('Offscreen audio: Playback failed:', e);
        sendResponse({ success: false, error: e.message || 'Playback failed' });
      });
    return true; // Crucial: indicates sendResponse will be called asynchronously
  }
  // Optional: handle other message types or return false for unhandled messages
  // return false; // If no other async handlers for other message types
}); 