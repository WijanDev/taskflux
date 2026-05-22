import {
  DEPLOY_TO_CLOUDFLARE,
  DEPLOY_TO_CLOUDFLARE_BUTTON,
} from '@/lib/site'
import { cn } from '@/lib/utils'

type DeployToCloudflareLinkProps = {
  className?: string
  imageClassName?: string
}

/** Official Cloudflare one-click Workers deploy button. */
export function DeployToCloudflareLink({
  className,
  imageClassName,
}: DeployToCloudflareLinkProps) {
  return (
    <a
      href={DEPLOY_TO_CLOUDFLARE}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-block rounded-md transition-opacity hover:opacity-90',
        className,
      )}
    >
      <img
        src={DEPLOY_TO_CLOUDFLARE_BUTTON}
        alt="Deploy to Cloudflare"
        className={cn('h-8 w-auto', imageClassName)}
      />
    </a>
  )
}
