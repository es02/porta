// @flow

import * as React from 'react'
import { useState } from 'react'

import {
  FormGroup,
  Select,
  SelectVariant
} from '@patternfly/react-core'
import {
  toSelectOption,
  toSelectOptionObject,
  SelectOptionObject
} from 'utilities'
import { TypeaheadTableModal } from 'Common'
import { ajaxJSON, paginateCollection } from 'utilities'

import type { Record } from 'utilities'

import './SelectWithModal.scss'

export type Props<T: Record> = {
  item: T | null,
  items: T[],
  itemsCount?: number,
  onSelect: (T | null) => void,
  isDisabled?: boolean,
  isValid?: boolean,
  label: string,
  id: string,
  name?: string,
  helperText?: React.Node,
  helperTextInvalid?: string,
  placeholderText?: string,
  maxItems?: number,
  header?: string,
  footer?: string,
  cells: { title: string, propName: string }[],
  modalTitle: string,
  fetchItemsPath: string
}

const MAX_ITEMS = 20
const HEADER = 'Most recently created'
const FOOTER = 'View all'

const SelectWithTypeaheadModal = <T: Record>({
  item,
  items: mostRecentItems,
  itemsCount = mostRecentItems.length,
  onSelect,
  isDisabled,
  isValid,
  label,
  id,
  name,
  helperText,
  helperTextInvalid,
  placeholderText,
  header = HEADER,
  footer = FOOTER,
  cells,
  modalTitle,
  fetchItemsPath
}: Props<T>): React.Node => {
  const emptyItem = { id: -1, name: 'No results found', disabled: true, privateEndpoint: '' }
  const headerItem = { id: 'header', name: header, disabled: true, className: 'pf-c-select__menu-item--group-name' }
  const footerItem = { id: 'foo', name: footer }
  const perPage = 5

  const [pageDictionary, setPageDictionary] = useState(() => paginateCollection(mostRecentItems, perPage))

  const [expanded, setExpanded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  const shouldShowFooter = (mostRecentItems.length < itemsCount) || (mostRecentItems.length > MAX_ITEMS)

  const handleOnSelectFromSelect = (_e, option: SelectOptionObject) => {
    setExpanded(false)

    if (option.id === footerItem.id) {
      setModalOpen(true)
    } else {
      const selectedBackend = mostRecentItems.find(b => String(b.id) === option.id)

      if (selectedBackend) {
        onSelect(selectedBackend)
      }
    }
  }

  // Takes an array of local items and returns the list of options for the select.
  // If the sum of all items is higher than 20, display link button to "View all Products"
  const getSelectOptions = (forItems: Array<T>) => {
    const selectItems = [headerItem]

    if (forItems.length === 0) {
      selectItems.push(emptyItem)
    } else {
      selectItems.push(...forItems.slice(0, MAX_ITEMS).map(i => ({ ...i, className: 'pf-c-select__menu-item-description' })))
    }

    if (shouldShowFooter) {
      selectItems.push(footerItem)
    }

    return selectItems.map(toSelectOption)
  }

  const options = getSelectOptions(mostRecentItems)

  const handleOnSelectFromSelectFilter = (e) => {
    const { value } = e.target
    const term = new RegExp(value, 'i')

    const filteredItems = value !== '' ? mostRecentItems.filter(b => term.test(b.name)) : mostRecentItems

    return getSelectOptions(filteredItems)
  }

  const handleOnSelectFromModal = (id: $PropertyType<T, 'id'>) => {
    const item = pageDictionary[page].find(i => i.id === id)
    if (item) {
      onSelect(item)
    }
    setModalOpen(false)
  }

  const handleOnSetModalPage = (page: number) => {
    // Calculate if there are enough items to fill next page
    const pageItems = pageDictionary[page]

    if (!pageItems || pageItems.length === 0) {
      // No items to fill next page, fetch that page
      fetchItems(page, perPage)
        .then(buyers => {
          setPageDictionary({ ...pageDictionary, [page]: buyers })
        })
        .catch(err => {
          console.error(err)
          console.error('An error ocurred. Please try again later.')
        })
    } else {
      // Enough items to fill next page, move on
    }

    setPage(page)
  }

  const fetchItems = (page: number, perPage: number): Promise<T[]> => {
    const url = `${fetchItemsPath}?page=${page}&per_page=${perPage}`
    setIsLoading(true)

    return ajaxJSON(url, 'GET')
      .then(async data => {
        if (data.ok) {
          return await data.json()
        } else {
          console.error('error ' + data.status)
          return []
        }
      })
      .finally(() => { setIsLoading(false) })
  }

  return (
    <>
      <FormGroup
        isRequired
        label={label}
        fieldId={id}
        helperText={helperText}
        helperTextInvalid={helperTextInvalid}
        isValid={isValid}
      >
        {item && <input type="hidden" name={name} value={item.id} />}
        <Select
          variant={SelectVariant.typeahead}
          placeholderText="Select a item"
          selections={item && toSelectOptionObject(item)}
          onToggle={() => setExpanded(!expanded)}
          onSelect={handleOnSelectFromSelect}
          isExpanded={expanded}
          isDisabled={isDisabled}
          onClear={() => onSelect(null)}
          aria-labelledby={id}
          className={shouldShowFooter ? 'pf-c-select__menu--with-fixed-link' : undefined}
          isGrouped
          onFilter={handleOnSelectFromSelectFilter}
        >
          {options}
        </Select>
      </FormGroup>

      <TypeaheadTableModal
        title={modalTitle}
        cells={cells}
        isOpen={modalOpen}
        isLoading={isLoading}
        selectedItem={item}
        pageItems={pageDictionary[page]}
        itemsCount={itemsCount}
        onSelect={handleOnSelectFromModal}
        onClose={() => setModalOpen(false)}
        page={page}
        perPage={perPage}
        setPage={handleOnSetModalPage}
      />
    </>
  )
}

export { SelectWithTypeaheadModal }
