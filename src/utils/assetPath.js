/**
 * Utility to resolve asset paths reliably regardless of base URL
 * (handles localhost, GitHub Pages subpaths, custom domains, etc.)
 */
export function resolveAsset(path) {
  if (!path) return ''
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  // Remove leading slashes or relative dot-slashes
  const cleanPath = path.replace(/^\.?\//, '')
  const base = import.meta.env.BASE_URL || './'
  
  if (base.endsWith('/')) {
    return `${base}${cleanPath}`
  }
  return `${base}/${cleanPath}`
}
