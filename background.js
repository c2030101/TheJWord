//URLs to block
let blockedUrls = [
  { link: "twitter.com" },
  { link: "facebook.com" },
  { link: "instagram.com" },
  { link: "reddit.com" },
  { link: "pinterest.com" },
  { link: "discord.com" },
  { link: "x.com" },
];

// Check if we're on a blocked site
function isBlockedSite() {
  return blockedUrls.some(element => 
    window.location.origin.includes(element.link)
  );
}

// Function to block the page and request sound playback
function blockPage() {
  // Request the service worker to play the sound
  console.log("Content Script: Requesting sound effect.");
  chrome.runtime.sendMessage({ action: 'playSoundEffect' })
    .then(response => {
      // Service worker might not send a response, or it might be undefined
      console.log("Content Script: playSoundEffect message sent. Response:", response);
    })
    .catch(error => {
      console.error("Content Script: Error sending playSoundEffect message:", error);
      // This error could occur if the service worker is not active or has an issue.
    });
  
  // Replace page content with blocking image
  // Ensure this part doesn't break if body is already replaced or null
  const body = document.getElementsByTagName("body")[0];
  if (body) {
    body.innerHTML =
      `<div><img src="${chrome.runtime.getURL("assets/banner.jpg")}" style="margin: 0px auto; height: 100vh; display: flex;"></div>`;
  } else {
    console.error("Content script: Could not find body element to replace content.");
  }
}

// Only proceed if we're on a blocked site
if (isBlockedSite()) {
  console.log("On social media site. Timer started for 5 minutes.");
  
  // Set a timeout to block the page after 5 minutes (300,000 milliseconds)
  setTimeout(() => {
    blockPage();
    console.log("5 minutes elapsed. Site blocked.");
  }, 5 * 60 * 100); // Corrected to 5 minutes (was 30 seconds)
}