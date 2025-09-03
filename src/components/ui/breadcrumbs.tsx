import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

export function Breadcrumbs() {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/" }
    ];

    let currentPath = "";
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert kebab-case to readable labels
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Special cases for better readability
      const specialLabels: Record<string, string> = {
        'about': 'About Us',
        'play': 'Training & Play',
        'clubs': 'Clubs',
        'auth': 'Authentication',
        'history-mission': 'History & Mission',
        'staff-board': 'Team Members',
        'advanced-para': 'Advanced & Para',
        'sign-in': 'Sign In',
        'sign-out': 'Sign Out'
      };
      
      const finalLabel = specialLabels[segment] || label;
      
      breadcrumbs.push({
        label: finalLabel,
        href: currentPath,
        current: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="py-4 px-6 bg-gray-50 border-b">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {breadcrumb.current ? (
              <span 
                className="font-medium text-gray-900"
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <NavLink
                to={breadcrumb.href}
                className={cn(
                  "hover:text-primary transition-colors",
                  index === 0 && "flex items-center space-x-1"
                )}
              >
                {index === 0 && <Home className="h-4 w-4" />}
                <span>{breadcrumb.label}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
