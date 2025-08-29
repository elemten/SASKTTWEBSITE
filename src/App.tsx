import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple page components
const HomePage = () => (
  <div className="min-h-screen bg-background p-8">
    <h1 className="text-4xl font-bold text-foreground mb-4">
      Table Tennis Saskatchewan
    </h1>
    <p className="text-lg text-muted-foreground mb-8">
      Welcome to the official Table Tennis Saskatchewan website.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Membership</h2>
        <p className="text-muted-foreground">Join our community of table tennis enthusiasts.</p>
      </div>
      <div className="p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Events</h2>
        <p className="text-muted-foreground">Participate in tournaments and training sessions.</p>
      </div>
      <div className="p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Equipment</h2>
        <p className="text-muted-foreground">Rent or purchase table tennis equipment.</p>
      </div>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
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

export default App;
