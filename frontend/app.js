import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const pingBackend = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/ping?name=${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Template app framework (React)</h1>
      <input
        type="text"
        placeholder="Type your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={pingBackend}>Click me</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
