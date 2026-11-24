import { Component, type PropsWithChildren } from 'react';

export class ErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <main role="alert">
          <h1>Something went wrong</h1>
          <p>Please reload the page to try again.</p>
          <button onClick={() => window.location.reload()}>Reload page</button>
        </main>
      );
    }

    return this.props.children;
  }
}
