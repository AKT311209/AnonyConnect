import Head from 'next/head';
import React from 'react';

export default function Home() {
  return (
    <>
      <Head>
        <title>AnonyConnect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="App">
        <header>
          <h1>AnonyConnect</h1>
        </header>
        <main>
          <section id="contact">
            <h2>Contact Me Anonymously</h2>
            <form>
              <input type="text" placeholder="Your Message" />
              <button type="submit">Send</button>
            </form>
          </section>
          <section id="chat">
            <h2>Live Anonymous Chat</h2>
            <p>Chat feature coming soon...</p>
          </section>
        </main>
      </div>
    </>
  );
}
