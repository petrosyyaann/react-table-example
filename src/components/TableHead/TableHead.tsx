import { Table, flexRender } from '@tanstack/react-table'
import { IBank } from 'types/Bank'

export const TableHead = (table: Table<IBank>) => (
  <thead>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            {...{
              className: header.column.getCanSort()
                ? 'cursor-pointer select-none'
                : '',
              onClick: header.column.getToggleSortingHandler(),
            }}
            style={{
              paddingLeft: header.column.id === 'code' ? '5px' : '',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

              {(header.column.getCanSort() &&
                {
                  asc: ' 🔼',
                  desc: ' 🔽',
                }[header.column.getIsSorted() as string]) ??
                ' ↕️'}
            </div>
          </th>
        ))}
      </tr>
    ))}
  </thead>
)
