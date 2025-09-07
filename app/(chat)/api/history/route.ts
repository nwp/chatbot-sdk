import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { getChatsByUserId, getUserByClerkId } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get('limit') || '10');
  const startingAfter = searchParams.get('starting_after');
  const endingBefore = searchParams.get('ending_before');

  if (startingAfter && endingBefore) {
    return new ChatSDKError(
      'bad_request:api',
      'Only one of starting_after or ending_before can be provided.',
    ).toResponse();
  }

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const dbUser = await getUserByClerkId(clerkUserId);

  if (!dbUser) {
    return new ChatSDKError('unauthorized:chat', 'User not found in database.').toResponse();
  }

  const chats = await getChatsByUserId({
    id: dbUser.id,
    limit,
    startingAfter,
    endingBefore,
  });

  return Response.json(chats);
}
