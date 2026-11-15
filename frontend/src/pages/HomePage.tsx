import { AsyncRegion } from '../shared/components/AsyncRegion';

export function HomePage() {
  return (
    <>
      <h1>Welcome to Flower & Flora</h1>
      <p>Our marketplace is being prepared.</p>
      <AsyncRegion title="Stores and products" state={{
        status: 'empty',
        message: 'Stores and products are not available yet. Please check back later.',
      }} />
    </>
  );
}
