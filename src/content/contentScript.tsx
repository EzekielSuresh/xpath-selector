// contentScript.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import App from "../App";

// --Helper Functions--
function injectCSS(shadowRoot: ShadowRoot, href: string) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = href;
  shadowRoot.appendChild(link);
}

function injectThemeVariables(shadowRoot: ShadowRoot) {
  const style = document.createElement("style");
  style.textContent = `
    :host {
      --radius: 0.625rem;
      --background: oklch(100% 0 0);
      --foreground: oklch(14.1% .005 285.823);
      --card: oklch(100% 0 0);
      --card-foreground: oklch(14.1% .005 285.823);
      --primary: oklch(21% .006 285.885);
      --primary-foreground: oklch(98.5% 0 0);
      --secondary: oklch(96.7% .001 286.375);
      --secondary-foreground: oklch(21% .006 285.885);
      --muted: oklch(96.7% .001 286.375);
      --muted-foreground: oklch(55.2% .016 285.938);
      --accent: oklch(96.7% .001 286.375);
      --accent-foreground: oklch(21% .006 285.885);
      --destructive: oklch(57.7% .245 27.325);
      --border: oklch(92% .004 286.32);
      --input: oklch(92% .004 286.32);
      --ring: oklch(70.5% .015 286.067);
    }
    .border { border-width: 1px; border-style: solid; }
  `;
  shadowRoot.appendChild(style);
}

// --UI Injection Logic--

let uiInjected = false
let container: HTMLDivElement | null=null
let root: Root | null=null

function injectUI() {
  if(uiInjected) return

  // Create floating container
  container = document.createElement("div");
  container.id = "xpath-selector-floating-ui";
  container.style.position = "fixed";
  container.style.maxWidth = "448px"
  container.style.width = "100%"
  container.style.top = "32px";
  container.style.right = "32px";
  container.style.zIndex = "999999";
  container.style.background = "none";
  container.style.pointerEvents = "none";

  // Attach Shadow DOM
  const shadow = container.attachShadow({ mode: "open" });

  // Inject theme variables
  injectThemeVariables(shadow);

  // Allow pointer events for Card
  const cardWrapper = document.createElement("div");
  cardWrapper.style.pointerEvents = "auto";
  // Optional: Dark Mode
  // cardWrapper.classList.add("dark");
  shadow.appendChild(cardWrapper);

  document.body.appendChild(container);

  // Inject CSS into Shadow DOM
  const cssHref = chrome.runtime.getURL("assets/index.css");
  injectCSS(shadow, cssHref);

  // Render React app into Shadow DOM
  root = createRoot(cardWrapper);
  root.render(
      <React.StrictMode>
          <App onClose={removeUI} />
      </React.StrictMode>
  );

  uiInjected = true
}

export function removeUI() {
  if (container) {
    container.remove()
    container = null
    uiInjected = false
    root = null
  }
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type == "show_xpath_selector"){
    injectUI()
  }
})