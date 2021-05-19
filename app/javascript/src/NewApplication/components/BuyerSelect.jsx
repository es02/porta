// @flow

import * as React from 'react'

import { SelectWithTypeaheadModal } from 'Common'

import type { Buyer } from 'NewApplication/types'

type Props = {
  buyer: Buyer | null,
  buyers: Buyer[],
  buyersCount: number,
  onSelectBuyer: (Buyer | null) => void,
  isDisabled?: boolean
}

const BuyerSelect = ({ buyer, buyers, buyersCount, onSelectBuyer, isDisabled }: Props): React.Node => {
  const cells = [
    { title: 'Name', propName: 'name' },
    { title: 'Admin', propName: 'admin' },
    { title: 'Signup date', propName: 'createdAt' }
  ]

  return (
    <SelectWithTypeaheadModal
      label="Account"
      fieldId="account_id"
      id="account_id"
      name="account_id"
      // $FlowIgnore[incompatible-type] Buyer implements Record
      item={buyer} // selectedItem
      items={buyers.map(b => ({ ...b, description: b.admin }))} // localItems
      itemsCount={buyersCount}
      cells={cells}
      modalTitle="Select an Account"
      // $FlowIssue[incompatible-type] It should not complain since Record.id has union "number | string"
      onSelect={onSelectBuyer}
      header="Most recently created Accounts"
      footer="View all Accounts"
      isDisabled={isDisabled}
      fetchItemsPath="/buyers/accounts.json" // TODO: pass url in props
    />
  )
}

export { BuyerSelect }
