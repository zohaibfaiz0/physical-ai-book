import React from 'react';
import Layout from '@theme/Layout';
import BookChat from '@site/src/components/BookChat';

// Custom layout wrapper that includes the BookChat component
export default function BookChatLayout(props) {
  return (
    <Layout {...props}>
      {/* Render the original content */}
      {props.children}
      {/* Add the BookChat component to all pages that use this layout */}
      <BookChat navbarMode={false} />
    </Layout>
  );
}