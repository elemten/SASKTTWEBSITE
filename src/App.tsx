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
  <div className="min-h-screen bg-background p-8">
    <h1 className="text-4xl font-bold text-foreground mb-4">
      Table Tennis Saskatchewan
    </h1>
    <p className="text-lg text-muted-foreground">
      Test page - if you can see this, the app is working!
    </p>
    <div className="mt-8 p-6 bg-card rounded-lg border">
      <h2 className="text-2xl font-semibold mb-4">Debug Info</h2>
      <p className="text-muted-foreground">
        This is a minimal test to check if the basic React app loads.
      </p>
    </div>
  </div>
);

export default App;
