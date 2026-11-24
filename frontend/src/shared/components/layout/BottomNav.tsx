import { NavLink, useLocation } from 'react-router';
import { Compass, Heart, Home, ShoppingBag, Store } from 'lucide-react';

interface BottomNavProps {
  cartCount: number;
  wishlistCount: number;
  onCartToggle?: () => void;
}

export function BottomNav({ cartCount, wishlistCount, onCartToggle }: BottomNavProps) {
  const location = useLocation();

  const handleCartClick = (event: React.MouseEvent) => {
    if (onCartToggle) {
      event.preventDefault();
      onCartToggle();
    }
  };

  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile Navigation" role="navigation">
      <NavLink
        end
        to="/"
        className={({ isActive }) => `dock-item ${isActive ? 'is-active' : ''}`}
        aria-label="Home"
      >
        <span className="dock-icon-wrap" aria-hidden="true">
          <Home size={20} />
        </span>
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/products"
        className={({ isActive }) => `dock-item ${isActive && location.pathname === '/products' ? 'is-active' : ''}`}
        aria-label="Products"
      >
        <span className="dock-icon-wrap" aria-hidden="true">
          <Compass size={20} />
        </span>
        <span>Flowers</span>
      </NavLink>

      <NavLink
        to="/shops"
        className={({ isActive }) => `dock-item ${isActive && location.pathname === '/shops' ? 'is-active' : ''}`}
        aria-label="Florist Shops"
      >
        <span className="dock-icon-wrap" aria-hidden="true">
          <Store size={20} />
        </span>
        <span>Shops</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={({ isActive }) => `dock-item ${isActive ? 'is-active' : ''}`}
        aria-label={`Wishlist with ${wishlistCount} items`}
      >
        <span className="dock-icon-wrap" aria-hidden="true">
          <Heart size={20} />
          {wishlistCount > 0 && (
            <span className="dock-badge" aria-hidden="true">
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </span>
          )}
        </span>
        <span>Wishlist</span>
      </NavLink>

      <NavLink
        to="/cart"
        onClick={handleCartClick}
        className={({ isActive }) => `dock-item ${isActive && location.pathname === '/cart' ? 'is-active' : ''}`}
        aria-label={`Shopping cart with ${cartCount} items`}
      >
        <span className="dock-icon-wrap" aria-hidden="true">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="dock-badge" aria-hidden="true">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </span>
        <span>Cart</span>
      </NavLink>
    </nav>
  );
}
