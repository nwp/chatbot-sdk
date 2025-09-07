
'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createUser } from './actions';

export default function WelcomePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function provisionUser() {
      if (user) {
        try {
          await createUser(user.id, user.primaryEmailAddress?.emailAddress);
          router.push('/');
        } catch (error) {
          console.error('Failed to provision user:', error);
          // You might want to show an error message to the user here
        }
      }
    }

    provisionUser();
  }, [user, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">
          Provisioning your user account...
        </h1>
        <p className="text-muted-foreground">
          Please wait while we set things up for you.
        </p>
      </div>
    </div>
  );
}
