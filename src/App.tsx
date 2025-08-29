import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Simple Navigation Component
const Navigation = () => (
  <nav style={{
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 50
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1e293b',
        textDecoration: 'none'
      }}>
        Table Tennis Saskatchewan
      </Link>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/membership" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>Membership</Link>
        <Link to="/events" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>Events</Link>
        <Link to="/rentals" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>Rentals</Link>
        <Link to="/about" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>About</Link>
        <Link to="/admin" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>Admin</Link>
      </div>
    </div>
  </nav>
);

// Simple page components
const HomePage = () => (
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
      Welcome to Table Tennis Saskatchewan
    </h1>
    <p style={{ 
      fontSize: '1.125rem', 
      color: '#64748b',
      marginBottom: '2rem'
    }}>
      The official website for table tennis enthusiasts in Saskatchewan.
    </p>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    }}>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>Membership</h2>
        <p style={{ color: '#64748b' }}>Join our community of table tennis enthusiasts.</p>
      </div>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>Events</h2>
        <p style={{ color: '#64748b' }}>Participate in tournaments and training sessions.</p>
      </div>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>Equipment</h2>
        <p style={{ color: '#64748b' }}>Rent or purchase table tennis equipment.</p>
      </div>
    </div>
  </div>
);

const App = () => {
  console.log('App component is rendering!');
  
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/membership" element={<HomePage />} />
        <Route path="/events" element={<HomePage />} />
        <Route path="/rentals" element={<HomePage />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/admin" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
