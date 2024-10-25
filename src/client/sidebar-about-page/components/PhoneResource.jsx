import React, { useState } from 'react';
import axios from 'axios';

const PhoneResource = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationResponse, setValidationResponse] = useState(null);
  const [error, setError] = useState(null);

  const validatePhone = async (
    numberWithPrefix,
    validationType = 'extended',
    formatNumber = false
  ) => {
    if (!numberWithPrefix || numberWithPrefix.length <= 0) {
      setError('[ERROR] Phone number is empty.');
      return;
    }

    const query = { numberWithPrefix };
    const options = { validationType, formatNumber };

    try {
      const response = await axios.post('/api/phone/validate', {
        query,
        options,
      });
      setValidationResponse(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const validatePhoneWithPrefix = (
    prefix,
    number,
    validationType = 'extended',
    formatNumber = false
  ) => {
    if (prefix.length <= 0) {
      setError('[ERROR] Phone prefix is empty.');
      return;
    }
    validatePhone(prefix + number, validationType, formatNumber);
  };

  const getPhoneType = (response) => {
    if (!response) return null;
    let result = response.result?.data?.carrier?.type;
    if (result === 'N/A') {
      result = response.resultCorrected?.data?.carrier?.type;
    }
    return result;
  };

  const getCarrierName = (response) => {
    if (!response) return null;
    let result = response.result?.data?.carrier?.name;
    if (result === 'N/A') {
      result = response.resultCorrected?.data?.carrier?.name;
    }
    return result;
  };

  return (
    <div>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number with prefix"
      />
      <button onClick={() => validatePhone(phoneNumber)}>Validate Phone</button>

      {validationResponse && (
        <div>
          <p>Phone Type: {getPhoneType(validationResponse)}</p>
          <p>Carrier Name: {getCarrierName(validationResponse)}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PhoneResource;
