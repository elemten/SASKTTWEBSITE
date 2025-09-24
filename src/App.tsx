import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Component, ReactNode, Suspense, lazy, useEffect } from "react";
import { PageLoadingFallback } from "@/components/ui/loading-spinner";
import { isLowEndMobile } from "@/lib/performance-utils";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";

// Lazy-loaded components for better code splitting
const Index = lazy(() => import("./pages/Index"));
const Membership = lazy(() => import("./pages/Membership"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Events = lazy(() => import("./pages/Events"));

const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));

// Secondary pages
const Clubs = lazy(() => import("./pages/Clubs"));
const ClubRegistration = lazy(() => import("./pages/ClubRegistration"));
const Coaching = lazy(() => import("./pages/Coaching"));
const Officials = lazy(() => import("./pages/Officials"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));

// About subsections
const AboutHistoryMission = lazy(() => import("./pages/about/HistoryMission"));
const AboutStaffBoard = lazy(() => import("./pages/about/StaffBoard"));
const AboutGovernance = lazy(() => import("./pages/about/Governance"));



// Play subsections
const PlayLocations = lazy(() => import("./pages/play/Locations"));
const PlayTraining = lazy(() => import("./pages/play/Training"));
const PlayAdvancedPara = lazy(() => import("./pages/play/AdvancedPara"));
const PlayClinics = lazy(() => import("./pages/play/Clinics"));
const PlaySPED = lazy(() => import("./pages/play/SPED"));
const TrainingSignup = lazy(() => import("./pages/TrainingSignup"));

// Auth pages - REMOVED

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Scroll restoration component that must be inside Router
function ScrollRestorationWrapper({ children }: { children: ReactNode }) {
  useScrollRestoration();
  return <>{children}</>;
}

const App = () => {
  // Performance optimizations
  useEffect(() => {
    const lowEnd = isLowEndMobile();

    // Enable CSS containment for better performance
    document.documentElement.style.contain = 'layout style paint';

    // Optimize scroll behavior
    document.documentElement.style.scrollBehavior = lowEnd ? 'auto' : 'smooth';

    // Aggressive performance optimizations for low-end devices
    if (lowEnd) {
      // Disable all animations and transitions
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          transform: none !important;
          will-change: auto !important;
        }

        .animate-gpu, .gpu-accelerated, .hover-optimized {
          transform: none !important;
          will-change: auto !important;
          animation: none !important;
          transition: none !important;
        }

        /* Simplify shadows on low-end devices */
        .shadow-soft, .shadow-medium, .shadow-strong, .shadow-lg, .shadow-xl {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
        }

        /* Disable hover effects on touch devices */
        @media (hover: none) {
          .group:hover, .hover\:scale-105:hover, .hover\:shadow-xl:hover {
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
        document.documentElement.style.contain = '';
        document.documentElement.style.scrollBehavior = '';
      };
    }

    return () => {
      // Cleanup
      document.documentElement.style.contain = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollRestorationWrapper>
            <ErrorBoundary>
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/events" element={<Events />} />

                <Route path="/about" element={<Navigate to="/about/history-mission" replace />} />
                {/* About subsections */}
                <Route path="/about/history-mission" element={<AboutHistoryMission />} />
                <Route path="/about/staff-board" element={<AboutStaffBoard />} />
                <Route path="/about/governance" element={<AboutGovernance />} />
                {/* Play & Train */}
                <Route path="/play/locations" element={<PlayLocations />} />
                <Route path="/play/training" element={<PlayTraining />} />
                <Route path="/play/advanced-para" element={<PlayAdvancedPara />} />
                <Route path="/play/clinics" element={<PlayClinics />} />
                <Route path="/play/sped" element={<PlaySPED />} />
                
                {/* Training Signup */}
                <Route path="/training-signup" element={<TrainingSignup />} />
                {/* Other sections */}
                <Route path="/clubs" element={<Clubs />} />
                <Route path="/clubs/register" element={<ClubRegistration />} />
                <Route path="/coaching" element={<Coaching />} />
                <Route path="/officials" element={<Officials />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Coming Soon page for auth features */}
                <Route path="/coming-soon" element={<ComingSoon />} />

                {/* Auth routes - REMOVED */}

                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          </ScrollRestorationWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
