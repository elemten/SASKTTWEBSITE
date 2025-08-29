const App = () => (
  <div style={{ 
    minHeight: '100vh', 
    backgroundColor: '#f8fafc', 
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <h1 style={{ 
      fontSize: '2.5rem', 
      fontWeight: 'bold', 
      color: '#1e293b',
      marginBottom: '1rem'
    }}>
      Table Tennis Saskatchewan
    </h1>
    <p style={{ 
      fontSize: '1.125rem', 
      color: '#64748b',
      marginBottom: '2rem'
    }}>
      Test page - if you can see this, the app is working!
    </p>
    <div style={{ 
      marginTop: '2rem', 
      padding: '1.5rem', 
      backgroundColor: 'white', 
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0'
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '600', 
        marginBottom: '1rem',
        color: '#1e293b'
      }}>
        Debug Info
      </h2>
      <p style={{ color: '#64748b' }}>
        This is a minimal test to check if the basic React app loads.
      </p>
    </div>
  </div>
);

export default App;
