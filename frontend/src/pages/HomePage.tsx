import { AsyncRegion } from '../shared/components/AsyncRegion';
import { Card } from '../shared/components/ui/Content';
import { Link } from 'react-router';

export function HomePage() {
  return (
    <>
      <div className="page-heading"><p className="eyebrow">A little closer to nature</p><h1>Welcome to Flower & Flora</h1>
      <p>Our marketplace is being prepared.</p></div>
      <AsyncRegion title="Stores and products" state={{
        status: 'ready',
        children: <><p>Explore our sample catalog. All shops and products shown are fictional.</p><div className="catalog-entry-links"><Link to="/shops">Browse sample shops</Link><Link to="/products">Browse sample products</Link></div></>,
      }} />
      <Card title="A place for flowers and flora"><p>A marketplace bringing floral products and the stores behind them together.</p></Card>
    </>
  );
}
