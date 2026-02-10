import React from 'react';
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import NavbarAuth from '@site/src/components/NavbarAuth';

// Simple placeholder components - replace with actual implementations
function NavbarChatContainer() {
  return <div id="navbar-chat-container" style={{marginRight: '8px'}}></div>;
}

function NavbarRagStatus() {
  return (
    <div className="navbar__item--rag-status" style={{display: 'flex', alignItems: 'center', marginRight: '8px'}}>
      <span className="rag-status-indicator" style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#22c55e',
        marginRight: '6px',
        display: 'inline-block'
      }}></span>
      <span style={{fontSize: '0.85rem'}}>RAG Active</span>
    </div>
  );
}

export default {
  ...ComponentTypes,
  'custom-navbarChatContainer': NavbarChatContainer,
  'custom-navbarRagStatus': NavbarRagStatus,
  'custom-navbarAuth': NavbarAuth,
};