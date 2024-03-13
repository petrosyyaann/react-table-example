import { Dispatch, SetStateAction } from 'react'
import { Table, flexRender } from '@tanstack/react-table'
import { IBank } from 'types/Bank'

export const TableBody = ({
  table,
  selectRows,
  setselectRows,
}: {
  table: Table<IBank>
  selectRows: number[]
  setselectRows: Dispatch<SetStateAction<number[]>>
}) => (
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            style={{
              paddingLeft: cell.column.id === 'code' ? '5px' : '',
            }}
            onClick={() => {
              selectRows.includes(row.index)
                ? setselectRows((prev) =>
                    prev.filter((value) => value !== row.index)
                  )
                : setselectRows((prev) => [...prev, row.index])
            }}
          >
            {cell.column.id === 'chekboxes' ? (
              <input
                readOnly
                type="checkbox"
                checked={selectRows.includes(row.index)}
              />
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
)
