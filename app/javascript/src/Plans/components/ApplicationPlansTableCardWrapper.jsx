// @flow

import React from 'react'

// $FlowFixMe[missing-export] export is there, name_mapper is the problem
import { ApplicationPlansTableCard } from 'Plans'
import { createReactWrapper } from 'utilities'
import type { Props } from 'Plans/components/ApplicationPlansTableCard'

const ApplicationPlansTableCardWrapper = (props: Props, containerId: string): void => (
  createReactWrapper(<ApplicationPlansTableCard {...props} />, containerId)
)

export { ApplicationPlansTableCardWrapper }
