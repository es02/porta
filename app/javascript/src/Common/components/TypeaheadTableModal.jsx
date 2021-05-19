// @flow

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import {
  Button,
  Modal,
  InputGroup,
  TextInput,
  Pagination,
  Spinner,
  Toolbar,
  ToolbarItem
} from '@patternfly/react-core'
import { Table, TableHeader, TableBody } from '@patternfly/react-table'
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon'

import type { Record } from 'utilities'

import './TableModal.scss'

type Props<T: Record> = {
  title: string,
  selectedItem: T | null,
  pageItems?: T[],
  itemsCount: number,
  onSelect: (id: $PropertyType<T, 'id'>) => void,
  onClose: () => void,
  cells: { title: string, propName: string }[],
  isOpen?: boolean,
  isLoading?: boolean,
  page: number,
  setPage: (number) => void,
  perPage?: number,
}

const PER_PAGE_DEFAULT = 5

const TypeaheadTableModal = <T: Record>({
  title,
  isOpen,
  isLoading = false,
  selectedItem: item,
  pageItems = [],
  itemsCount,
  onSelect,
  onClose,
  perPage = PER_PAGE_DEFAULT,
  page,
  setPage,
  cells
}: Props<T>): React.Node => {
  const [selectedId, setSelectedId] = useState(item ? item.id : null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (item !== null && item.id !== selectedId) {
      setSelectedId(item.id)
    }
  }, [item])

  // useEffect(() => {
  //   if (isOpen) {
  //     setLocalItems(items)
  //     setPage(1)
  //   }
  // }, [isOpen])

  // DISABLE ALL SEARCH FOR NOW
  // useEffect(() => {
  //   if (searchInputRef.current) {
  //     searchInputRef.current.addEventListener('input', ({ inputType }) => {
  //       if (!inputType) search()
  //     })
  //   }
  // }, [searchInputRef.current])

  const handleOnSearch = () => {
    // if (searchInputRef.current) {
    //   search(searchInputRef.current.value)
    // }
  }

  // const search = (term: string = '') => {
  //   setFilteredItems(items.filter(i => i.name.includes(term)))
  //   setPage(1)
  // }

  const handleOnSelect = (_e, _i, rowId: number) => {
    setSelectedId(pageItems[rowId].id)
  }

  const handleOnTextInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      // handleOnSearch()
    }
  }

  const pagination = (
    <Pagination
      perPage={perPage}
      itemCount={itemsCount}
      page={page}
      onSetPage={(_e, page) => setPage(page)}
      widgetId="pagination-options-menu-top"
      isDisabled={isLoading}
    />
  )

  const rows = pageItems.map((i) => ({
    selected: i.id === selectedId,
    cells: cells.map(({ propName }) => i[propName])
  }))

  const onAccept = () => {
    if (selectedId !== null) {
      onSelect(selectedId)
    }
  }

  return (
    <Modal
      isLarge
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      isFooterLeftAligned={true}
      actions={[
        <Button key="Select" variant="primary" isDisabled={selectedId === null || isLoading} onClick={onAccept} data-testid="select">Select</Button>,
        <Button key="Cancel" variant="secondary" isDisabled={isLoading} onClick={onClose} data-testid="cancel">Cancel</Button>
      ]}
    >
      {/* Toolbar is a component in the css, but a layout in react, so the class names are mismatched (pf-c-toolbar vs pf-l-toolbar) Styling doesn't work, but if you change it to pf-c in the inspector, it works */}
      <Toolbar className="pf-c-toolbar pf-u-justify-content-space-between">
        <ToolbarItem>
          <InputGroup>
            <TextInput
              type="search"
              aria-label="search for an item"
              ref={searchInputRef}
              onKeyDown={handleOnTextInputKeyDown}
              isDisabled={isLoading}
            />
            <Button variant="control" aria-label="search button for search input" onClick={handleOnSearch} data-testid="search" isDisabled={isLoading}>
              <SearchIcon />
            </Button>
          </InputGroup>
        </ToolbarItem>
        <ToolbarItem>
          {pagination}
        </ToolbarItem>
      </Toolbar>
      {isLoading ? <Spinner size='xl' /> : (
        <Table
          aria-label={title}
          sortBy={() => {}}
          onSort={() => {}}
          onSelect={handleOnSelect}
          cells={cells}
          rows={rows}
          selectVariant='radio'
        >
          <TableHeader />
          <TableBody />
        </Table>
      )}
      {pagination}
    </Modal>
  )
}

export { TypeaheadTableModal }
