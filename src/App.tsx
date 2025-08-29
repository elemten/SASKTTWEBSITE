import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Component, ReactNode } from "react";

// Direct imports to fix white screen issue
import Index from "./pages/Index";
import Membership from "./pages/Membership";
import Events from "./pages/Events";
import Rentals from "./pages/Rentals";
import About from "./pages/About";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
// New pages (shells)
import Clubs from "./pages/Clubs";
import Coaching from "./pages/Coaching";
import Officials from "./pages/Officials";
import Resources from "./pages/Resources";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AboutHistoryMission from "./pages/about/HistoryMission";
import AboutStaffBoard from "./pages/about/StaffBoard";
import AboutGovernance from "./pages/about/Governance";
import PlayLocations from "./pages/play/Locations";
import PlayTraining from "./pages/play/Training";
import PlayAdvancedPara from "./pages/play/AdvancedPara";
import PlayClinics from "./pages/play/Clinics";

// Error boundary for lazy routes
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Route loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              We're having trouble loading this page. Please try refreshing.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/events" element={<Events />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/about" element={<About />} />
            {/* About subsections */}
            <Route path="/about/history-mission" element={<AboutHistoryMission />} />
            <Route path="/about/staff-board" element={<AboutStaffBoard />} />
            <Route path="/about/governance" element={<AboutGovernance />} />
            {/* Play & Train */}
            <Route path="/play/locations" element={<PlayLocations />} />
            <Route path="/play/training" element={<PlayTraining />} />
            <Route path="/play/advanced-para" element={<PlayAdvancedPara />} />
            <Route path="/play/clinics" element={<PlayClinics />} />
            {/* Other sections */}
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/officials" element={<Officials />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
