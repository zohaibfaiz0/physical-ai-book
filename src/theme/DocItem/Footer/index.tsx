import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import CompletionButton from '@site/src/components/CompletionButton';

export default function FooterWrapper(props) {
  let chapterId = '';

  try {
    const { useDoc } = require('@docusaurus/plugin-content-docs/client');
    const { metadata } = useDoc();
    chapterId = metadata.id || metadata.slug || '';
  } catch (e) {
    // fallback if useDoc is not available
    chapterId = typeof window !== 'undefined' ? window.location.pathname : '';
  }

  return (
    <React.Fragment>
      <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
        <CompletionButton chapterId={chapterId} />
      </div>
      <Footer {...props} />
    </React.Fragment>
  );
}