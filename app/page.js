'use client'
import { useState } from 'react';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoUrl }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Analyze GitHub Repo with SonarCloud</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter GitHub repo URL"
          required
        />
        <button type="submit">Analyze</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}