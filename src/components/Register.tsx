import React, { useEffect, useState } from 'react';
import {
  useLazyCheckStatusQuery,
  useRegisterUserMutation,
} from '../api/apiSlice';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();
  const [
    triggerCheckStatus,
    { data: statusData, isFetching: isCheckingStatus },
  ] = useLazyCheckStatusQuery();

  const handleRegister = async () => {
    try {
      await registerUser({
        name,
        email,
      }).unwrap();
      alert('Registration successful. Now you can check the status.');
      setIsPolling(true);
      triggerCheckStatus();
    } catch (error) {
      if (error instanceof Error) {
        alert('Registration failed.');
      }
    }
  };

  useEffect(() => {
    let pollingInterval = null;

    if (isPolling) {
      // Poll every 3 seconds
      pollingInterval = setInterval(() => {
        triggerCheckStatus();
      }, 3000);
    }

    // Clean up polling when component unmounts or polling stops
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isPolling, triggerCheckStatus]);

  const handleCheckStatus = () => {
    setIsPolling(true);
  };

  useEffect(() => {
    if (statusData?.status === 'SUCCESS') {
      setIsPolling(false);
      alert('Success');
    }
  }, [statusData]);

  return (
    <div>
      <input
        type='text'
        placeholder='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRegister} disabled={isRegistering}>
        {isRegistering ? 'Registering...' : 'Register'}
      </button>

      <button onClick={handleCheckStatus}>Check Status</button>

      {isPolling && (
        <div>
          <p>Checking status in the background...</p>
          {isCheckingStatus ? (
            <p>Checking...</p>
          ) : (
            <p>
              Status:{' '}
              {statusData
                ? JSON.stringify(statusData)
                : 'No status available yet.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Register;
