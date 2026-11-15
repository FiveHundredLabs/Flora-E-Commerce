import { AsyncRegion } from '../shared/components/AsyncRegion';
import { Card } from '../shared/components/ui/Content';

export function HomePage() {
  return (
    <>
      <div className="page-heading"><p className="eyebrow">A little closer to nature</p><h1>Welcome to Flower & Flora</h1>
      <p>Our marketplace is being prepared.</p></div>
      <AsyncRegion title="Stores and products" state={{
        status: 'empty',
        message: 'Stores and products are not available yet. Please check back later.',
      }} />
      <Card title="A place for flowers and flora"><p>A marketplace bringing floral products and the stores behind them together.</p></Card>
    </>
  );
}
