export const GITHUB_REPO = 'https://github.com/WijanDev/taskflux'

/** One-click deploy to a user's Cloudflare account (Workers Builds). */
export const DEPLOY_TO_CLOUDFLARE = `https://deploy.workers.cloudflare.com/?url=${encodeURIComponent(GITHUB_REPO)}`

export const DEPLOY_TO_CLOUDFLARE_BUTTON =
  'https://deploy.workers.cloudflare.com/button'
