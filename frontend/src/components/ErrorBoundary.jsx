import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '40px',
          background: '#0A0A12',
          color: '#FF4444',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Application Error</h1>
          <pre style={{
            background: '#1A1A2E',
            padding: '20px',
            borderRadius: '12px',
            maxWidth: '800px',
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.5',
            border: '1px solid rgba(255,68,68,0.3)',
          }}>
            {this.state.error.toString()}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
