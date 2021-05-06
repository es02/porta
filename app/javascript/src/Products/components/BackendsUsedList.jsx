// @flow

import * as React from 'react'
import { useState, useRef } from 'react'

import {
  Button,
  ButtonVariant,
  InputGroup,
  TextInput,
  PageSection,
  PageSectionVariants
} from '@patternfly/react-core'
import { Table, TableBody } from '@patternfly/react-table'
import { SearchIcon } from '@patternfly/react-icons'
import { MicroPagination } from 'Common'
import { createReactWrapper } from 'utilities/createReactWrapper'
import { useSearchInputEffect } from 'utilities/custom-hooks'

import './BackendsUsedList.scss'

import type { Backend } from 'Types'

type Props = {
  backends: Array<Backend>
}

const PER_PAGE = 5

const BackendsUsedList = ({ backends }: Props): React.Node => {
  const [page, setPage] = useState(1)
  const [filteredBackends, setFilteredBackends] = useState(backends)
  const searchInputRef = useRef(null)

  const search = (term: string = '') => {
    setFilteredBackends(backends.filter(b => {
      const regex = new RegExp(term, 'i')
      return regex.test(b.name)
    }))
    setPage(1)
  }

  useSearchInputEffect(searchInputRef, search)

  const handleOnSearch = () => {
    if (searchInputRef.current) {
      search(searchInputRef.current.value)
    }
  }

  const handleOnTextInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOnSearch()
    }
  }

  const lastPage = Math.ceil(filteredBackends.length / PER_PAGE)
  const pageItems = filteredBackends.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const columns = ['Name', 'System name']
  const rows = pageItems.map(b => ({
    cells: [
      { title: <Button href={b.path} component="a" variant="link" isInline>{b.name}</Button> },
      b.privateEndpoint
    ]
  }))

  const header = (
    <InputGroup>
      <TextInput
        type="search"
        aria-label="search for an item"
        ref={searchInputRef}
        onKeyDown={handleOnTextInputKeyDown}
        placeholder="Find a Backend"
      />
      <Button variant={ButtonVariant.control} aria-label="search button for search input" onClick={handleOnSearch} data-testid="search">
        <SearchIcon />
      </Button>
    </InputGroup>
  )

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Table
        header={header}
        aria-label="Backends used in this product"
        cells={columns}
        rows={rows}
      >
        <TableBody />
      </Table>
      <MicroPagination page={page} setPage={setPage} lastPage={lastPage} />
    </PageSection>
  )
}

const BackendsUsedListWrapper = (props: Props, containerId: string): void => createReactWrapper(<BackendsUsedList {...props} />, containerId)

export { BackendsUsedList, BackendsUsedListWrapper }
