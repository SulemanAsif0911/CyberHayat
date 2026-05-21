const copyButtons = document.querySelectorAll("[data-copy]");
const activeTimeouts = new Map();

/**
 * Fallback copy method for older mobile browsers or non-HTTPS environments
 */
const fallbackCopyText = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback failed to copy text: ", err);
  }

  document.body.removeChild(textArea);
};

copyButtons.forEach((button) => {
  // Add screen-reader support
  if (!button.hasAttribute("aria-live")) {
    button.setAttribute("aria-live", "polite");
  }

  button.addEventListener("click", async () => {
    const number = button.dataset.copy;
    const originalText = "Copy"; // Matches your static HTML design text

    if (!number) return;

    // 1. Execute Copy operation
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(number);
        button.textContent = "Copied!";
      } catch {
        fallbackCopyText(number);
        button.textContent = "Copied!";
      }
    } else {
      fallbackCopyText(number);
      button.textContent = "Copied!";
    }

    // 2. Prevent multi-click stuttering by clearing previous timers on this button
    if (activeTimeouts.has(button)) {
      clearTimeout(activeTimeouts.get(button));
    }

    // 3. Revert button text back to original after 1.4 seconds
    const timeoutId = window.setTimeout(() => {
      button.textContent = originalText;
      activeTimeouts.delete(button);
    }, 1400);

    activeTimeouts.set(button, timeoutId);
  });
});