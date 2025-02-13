import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
  ]);

  if (!user) {
    return redirect('/dashboard/auth');
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 gap-4">
      DashboardPage
    </div>
  );
}
