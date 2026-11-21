import { Route, Routes, useLocation } from 'react-router';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteAccessibility } from './RouteAccessibility';
import { Shell } from '../shared/components/layout/Shell';
import { AdminPage } from '../pages/AdminPage';
import { DiscoveryPage } from '../pages/DiscoveryPage';
import { CommercePage } from '../pages/CommercePage';
import { SupplierPage } from '../pages/SupplierPage';
import { WishlistPage } from '../pages/WishlistPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { DesignSystemPreview } from '../pages/dev/DesignSystemPreview';
import { ToastProvider } from '../shared/components/ui/Toast';

export function App() {
  const { pathname } = useLocation();
  const audience = pathname === '/supplier' || pathname.startsWith('/supplier/') ? 'supplier'
    : pathname === '/admin' || pathname.startsWith('/admin/') ? 'admin' : 'customer';
  return (
    <ToastProvider>
      <RouteAccessibility />
      <Shell key={audience} audience={audience}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shops" element={<DiscoveryPage kind="shops" />} />
          <Route path="/shops/:slug" element={<DiscoveryPage kind="shops" detail />} />
          <Route path="/products" element={<DiscoveryPage kind="products" />} />
          <Route path="/products/:slug" element={<DiscoveryPage kind="products" detail />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CommercePage screen="cart" />} />
          <Route path="/checkout" element={<CommercePage screen="checkout" />} />
          <Route path="/account/orders" element={<CommercePage screen="orders" />} />
          <Route path="/account/orders/:orderId" element={<CommercePage screen="order" />} />
          <Route path="/supplier" element={<SupplierPage screen="overview" />} />
          <Route path="/supplier/register" element={<SupplierPage screen="registration" />} />
          <Route path="/supplier/profile" element={<SupplierPage screen="profile" />} />
          <Route path="/supplier/products" element={<SupplierPage screen="products" />} />
          <Route path="/supplier/products/new" element={<SupplierPage screen="newProduct" />} />
          <Route path="/supplier/products/:productId" element={<SupplierPage screen="product" />} />
          <Route path="/supplier/inventory" element={<SupplierPage screen="inventory" />} />
          <Route path="/supplier/orders" element={<SupplierPage screen="orders" />} />
          <Route path="/supplier/sales" element={<SupplierPage screen="sales" />} />
          <Route path="/admin" element={<AdminPage screen="overview" />} />
          <Route path="/admin/categories/new" element={<AdminPage screen="newCategory" />} />
          {(['suppliers', 'users', 'categories', 'orders', 'refunds', 'reviews'] as const).map((section) => <Route key={section} path={`/admin/${section}`}>
            <Route index element={<AdminPage screen={section} />} />
            <Route path=":recordId" element={<AdminPage screen={section} detail />} />
          </Route>)}
          {import.meta.env.DEV && <Route path="/dev/design-system" element={<DesignSystemPreview />} />}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Shell>
    </ToastProvider>
  );
}
