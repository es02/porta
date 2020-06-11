import { ActiveDocsSpecWrapper as ActiveDocsSpec } from 'ActiveDocs/components/ActiveDocsSpec'
import { autocompleteOAS3 } from './OAS3Autocomplete'

document.addEventListener('DOMContentLoaded', async () => {
  const containerId = 'swagger-ui-container'
  const AUTOCOMPLETE_CONFIG = {
    dataUrl: {
      provider: '/p/admin/api_docs/account_data.json',
      buyer: '/api_docs/account_data.json'
    }
  }
  const { url, baseUrl, accountType } = document.getElementById(containerId).dataset
  const dataUrl = accountType ? AUTOCOMPLETE_CONFIG.dataUrl[accountType] : AUTOCOMPLETE_CONFIG.dataUrl['buyer']

  const accountDataUrl = `${baseUrl}${dataUrl}`

  ActiveDocsSpec({ url, accountDataUrl, autocompleteOAS3 }, containerId)
})
