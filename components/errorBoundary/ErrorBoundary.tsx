import React from 'react';
import { ReactElement } from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import Fallback from './FallBackComponent';

const ErrorWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>
);

export default ErrorWrapper;
