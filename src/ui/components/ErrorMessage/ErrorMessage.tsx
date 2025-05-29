import React, { FunctionComponent } from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className={styles.errorContainer} role="alert">
      <p className={styles.errorMessage}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
