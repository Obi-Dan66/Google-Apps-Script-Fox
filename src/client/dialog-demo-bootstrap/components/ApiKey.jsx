import React, { useState } from 'react';
import { Browser } from 'eslint-plugin-googleappsscript';

const ApiKey = () => {
  const [apiKey, setApiKey] = useState('');

  const handleSetApiKey = () => {
    const userApiKey = Browser.inputBox('Enter your API key:', 'API Key');

    if (
      userApiKey !== null &&
      userApiKey.toLowerCase() !== 'cancel' &&
      userApiKey.length > 0
    ) {
      setApiKey(userApiKey);
      localStorage.setItem('API_KEY', userApiKey);
      alert('API key set successfully!');
    } else {
      alert('There was an error setting API key!');
    }
  };

  return (
    <div>
      <button onClick={handleSetApiKey}>Set API Key</button>
    </div>
  );
};

export default ApiKey;
