import React from 'react';
import Layout from '@theme/Layout';
import BookChat from '@site/src/components/BookChat';

// Custom layout for documentation pages that includes the BookChat
export default function DocPageWithBookChat(props) {
  return (
    <Layout {...props}>
      {props.children}
      {/* Floating BookChat component */}
      <BookChat navbarMode={false} />
    </Layout>
  );
}