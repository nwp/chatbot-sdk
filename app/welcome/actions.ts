
'use server';

import { createUserWithClerkId } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export async function createUser(clerkId: string, email?: string) {
  await createUserWithClerkId(clerkId, email);
  revalidatePath('/');
}
