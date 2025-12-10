import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

// Component that adds BookChat to documentation pages
export default function DocPageEnhancer({ children }) {
  const { metadata } = useDoc ? useDoc() : {};

  // Only add BookChat on doc pages, not on other pages
  if (metadata) {
    // Import dynamically to avoid SSR issues
    return (
      <>
        {children}
        <div style={{ display: 'none' }} id="bookchat-injector" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Wait for the DOM to be ready and React to be available
                function injectBookChat() {
                  if (window.React && window.ReactDOM) {
                    // Dynamically import the BookChat component
                    import('/src/components/BookChat')
                      .then(module => {
                        const BookChat = module.default;
                        if (BookChat) {
                          // Create a container for the floating chat button
                          const chatContainer = document.createElement('div');
                          document.body.appendChild(chatContainer);

                          // Create a React root and render the BookChat component
                          const root = window.ReactDOM.createRoot(chatContainer);
                          root.render(window.React.createElement(BookChat, { navbarMode: false }));
                        }
                      })
                      .catch(err => console.error('Error loading BookChat:', err));
                  } else {
                    // If React is not ready yet, try again in 100ms
                    setTimeout(injectBookChat, 100);
                  }
                }

                // Start the injection process
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', injectBookChat);
                } else {
                  injectBookChat();
                }
              })();
            `,
          }}
        />
      </>
    );
  }

  return children;
}