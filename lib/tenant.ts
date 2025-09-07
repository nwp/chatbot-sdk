import type { NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import type { Tenant } from '@/components/tenant-provider';

/**
 * Extract subdomain from request headers
 * Returns null if no subdomain or if on root domain
 */
export function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch?.[1]) {
      return fullUrlMatch[1];
    }

    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  // TODO: Update this with your actual root domain
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'chatbot-sdk.com';
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts[0] ?? null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

/**
 * Convert Clerk Organization to serializable Tenant
 */
function organizationToTenant(organization: any): Tenant {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    imageUrl: organization.imageUrl,
    membersCount: organization.membersCount,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
    publicMetadata: organization.publicMetadata,
    privateMetadata: organization.privateMetadata,
  };
}

/**
 * Resolve a subdomain slug to a serializable Tenant
 * Returns null if not found
 */
export async function resolveSubdomainToOrganization(
  subdomain: string,
): Promise<Tenant | null> {
  try {
    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({
      slug: subdomain,
    });
    return organizationToTenant(organization);
  } catch (error) {
    console.warn(`Organization not found for subdomain: ${subdomain}`, error);
    return null;
  }
}
