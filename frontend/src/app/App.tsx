import { Route, Routes, useLocation } from 'react-router';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteAccessibility } from './RouteAccessibility';
import { Shell } from '../shared/components/layout/Shell';
import { WorkspacePage } from '../pages/WorkspacePage';

export function App() {
  const { pathname } = useLocation();
  const audience = pathname === '/supplier' || pathname.startsWith('/supplier/') ? 'supplier'
    : pathname === '/admin' || pathname.startsWith('/admin/') ? 'admin' : 'customer';
  return (
    <>
      <RouteAccessibility />
      <Shell key={audience} audience={audience}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/supplier" element={<WorkspacePage audience="supplier" />} />
          <Route path="/admin" element={<WorkspacePage audience="admin" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Shell>
    </>
  );
}
