import React, { useState } from 'react';
import axios from 'axios';

const EmailResource = () => {
  const [email, setEmail] = useState('');
  const [validationResponse, setValidationResponse] = useState(null);
  const [error, setError] = useState(null);

  const validateEmail = async (
    email,
    validationType = 'extended',
    acceptDisposableEmails = true,
    acceptFreemails = true
  ) => {
    if (email.length <= 0) {
      setError('[ERROR] E-mail is empty.');
      return;
    }

    const query = { email };
    const options = { validationType, acceptDisposableEmails, acceptFreemails };

    try {
      const response = await axios.post('/api/email/validate', {
        query,
        options,
      });
      setValidationResponse(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const isFreemail = (response, source = 'result') => {
    if (!response) return null;
    const result = response[source]?.flags?.isFreemail;
    return result !== undefined ? result : 'N/A';
  };

  const isDisposable = (response, source = 'result') => {
    if (!response) return null;
    const result = response[source]?.flags?.isDisposableEmailAddress;
    return result !== undefined ? result : 'N/A';
  };

  const isCatchAllServer = (response, source = 'result') => {
    if (!response) return null;
    const result = response[source]?.flags?.isCatchAllServer;
    return result !== undefined ? result : 'N/A';
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <button onClick={() => validateEmail(email)}>Validate Email</button>

      {validationResponse && (
        <div>
          <p>Is Freemail: {isFreemail(validationResponse)}</p>
          <p>Is Disposable: {isDisposable(validationResponse)}</p>
          <p>Is Catch-All Server: {isCatchAllServer(validationResponse)}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EmailResource;
