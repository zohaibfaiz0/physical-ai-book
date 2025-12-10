import React from 'react';
import ReactDOM from 'react-dom/client';
import BookChat from './BookChat';

// Function to render the navbar chat component
export const renderNavbarChat = () => {
  const container = document.getElementById('navbar-chat-container');
  if (container) {
    // Create a React root and render the BookChat component in navbar mode
    const root = ReactDOM.createRoot(container);
    root.render(<BookChat navbarMode={true} />);
  }
};

// Run after DOM is loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavbarChat);
  } else {
    // DOM is already loaded, run immediately
    renderNavbarChat();
  }
}