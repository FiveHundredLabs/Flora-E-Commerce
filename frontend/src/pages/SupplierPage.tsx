import { SupplierScreen, type SupplierScreenName } from '../features/supplier';

export function SupplierPage({ screen }: { screen: SupplierScreenName }) {
  return <SupplierScreen screen={screen} />;
}
