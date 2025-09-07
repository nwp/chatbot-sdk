import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Script from 'next/script';
import { DataStreamProvider } from '@/components/data-stream-provider';
import { getUserByClerkId } from '@/lib/db/queries';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const dbUser = await getUserByClerkId(user.id);

  if (!dbUser) {
    redirect('/welcome');
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <SidebarProvider defaultOpen={!isCollapsed}>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
