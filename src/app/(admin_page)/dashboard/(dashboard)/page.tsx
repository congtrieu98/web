import { pathName } from '@/config/dashboard';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  redirect(pathName.categories);
}
