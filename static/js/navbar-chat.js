// This is a built version of the NavbarBookChat component
// It includes the BookChat component and renders it in the navbar

// Wait for React and ReactDOM to be available
function initializeNavbarChat() {
  if (window.React && window.ReactDOM && window.BookChat) {
    // Create the navbar chat container if it doesn't exist
    let container = document.getElementById('navbar-chat-container');
    if (!container) {
      // If container doesn't exist, try to create it in the navbar
      const navbarItems = document.querySelector('.navbar__items--right');
      if (navbarItems) {
        const newContainer = document.createElement('div');
        newContainer.id = 'navbar-chat-container';
        newContainer.style.marginLeft = '0.5rem';
        navbarItems.appendChild(newContainer);
        container = newContainer;
      }
    }

    if (container) {
      // Create a React root and render the BookChat component in navbar mode
      const root = window.ReactDOM.createRoot(container);
      root.render(window.React.createElement(window.BookChat, { navbarMode: true }));
    }
  } else {
    // If React libraries are not available yet, try again in 100ms
    setTimeout(initializeNavbarChat, 100);
  }
}

// Run after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavbarChat);
} else {
  // DOM is already loaded, run immediately
  initializeNavbarChat();
}