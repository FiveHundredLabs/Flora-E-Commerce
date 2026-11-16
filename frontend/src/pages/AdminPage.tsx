import { AdminScreen, type AdminScreenName } from '../features/admin';

export function AdminPage({ screen, detail }: { screen: AdminScreenName; detail?: boolean }) {
  return <AdminScreen screen={screen} detail={detail} />;
}
