import React, { ErrorInfo } from 'react';
import Error from 'next/error';
import Router from 'next/router';
import logging from '../../../utils/logging';

type ErrorBoundaryProps = { children: React.ReactElement };
type ErrorBoundaryState = { hasError: boolean };

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Component constructor
   * @param props Component Props
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  /**
   * Returning new state after error (method called by React when error happens)
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Catcher for ALL render errors of the application
   * @param error thrown error
   */
  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    logging.error(error as Error, errorInfo);
  }

  /**
   * The action that the user can do after being stuck on the error page
   */
  onErrorResolve() {
    Router.push('/'); // Removing the user from the bugged page
    this.setState({ hasError: false }); // Allowing the user to use the app again
  }

  /**
   * Component Render
   */
  render() {
    if (this.state.hasError) {
      return <Error statusCode={500} title="Aconteceu um erro inesperado e nossos programadores foram avisados" />;
    }
    // No error, so return the children
    return this.props.children;
  }
}

export default ErrorBoundary;
