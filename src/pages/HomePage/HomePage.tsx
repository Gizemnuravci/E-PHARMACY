import { Navigate } from 'react-router-dom';

/** Post-login landing route redirects to shop setup. */
export function HomePage() {
  return <Navigate to="/shop" replace />;
}
