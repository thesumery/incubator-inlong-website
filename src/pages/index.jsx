import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Home from './Home'
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function() {
  const isBrowser = useIsBrowser();
  const {siteConfig} = useDocusaurusContext();

  const pathname = isBrowser && location.pathname

  useEffect(() => {
    if (isBrowser) {
      const script = document.createElement('script');
      script.src = 'https://www.apachecon.com/event-images/snippet.js';
      document.body.appendChild(script);
    }
  }, [isBrowser])

  useEffect(() => {
    if (isBrowser) {
      const nav = document.getElementsByTagName('nav')[0];
      const classList = nav &&  nav.classList;
      if(!classList) return;
      if (pathname === '/' || pathname === '/zh-CN/') {
        classList.add('index-nav');
      } else {
        classList.remove('index-nav');
      }
    }
  }, [isBrowser, pathname])

  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <main>
        <Home />
      </main>
    </Layout>
  );
}
