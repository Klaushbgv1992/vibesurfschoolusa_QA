"use client";

import { usePathname } from 'next/navigation';
import PayPalProviderClient from "./PayPalProviderClient";

export default function ConditionalPayPalProvider({ children, clientId }) {
  const pathname = usePathname();
  
  // Check if we're in the admin section
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Admin routes don't need PayPal
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // Regular routes with PayPal
  if (clientId) {
    return (
      <PayPalProviderClient clientId={clientId}>
        {children}
      </PayPalProviderClient>
    );
  }
  
  // Error state if PayPal is missing but required
  return (
    <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
      PayPal integration error: Missing Client ID. Please check your .env.local and restart the server.
    </div>
  );
}
