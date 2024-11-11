import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Insppa Plate Number Issuing App'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
