import React from 'react';

function App() {
  return (
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
  );
}

export default App;
