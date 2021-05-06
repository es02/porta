// @flow

import { BackendsUsedListWrapper } from 'Products'
import { safeFromJsonString } from 'utilities/json-utils'

const containerId = 'backends-used-list-container'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById(containerId)

  if (!container) {
    return
  }

  const { backends } = container.dataset

  BackendsUsedListWrapper({
    backends: safeFromJsonString(backends) || []
  }, containerId)
})
