// @flow

import React from 'react'
import { mount } from 'enzyme'

import { BackendsUsedList } from 'Products'

const defaultProps = {
  backends: []
}

const mountWrapper = (props) => mount(<BackendsUsedList {...{ ...defaultProps, ...props }} />)

afterEach(() => {
  jest.resetAllMocks()
})

it('should render itself', () => {
  const wrapper = mountWrapper()
  expect(wrapper.exists()).toBe(true)
})
