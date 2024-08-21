import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "./DragHandle";
import styled from "styled-components";

const DraggingRow = styled.td`
  background: rgba(127, 207, 250, 0.3);
`;

const TableData = styled.td`
  background: white;
  &:first-of-type {
    min-width: 20ch;
  }
`;

export const DraggableTableRow = ({ row }) => {
    const {
        attributes,
        listeners,
        transform,
        transition,
        setNodeRef,
        isDragging
    } = useSortable({
        id: row.original._id
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition
    };
    return (
        <tr ref={setNodeRef} style={style} {...row.getRowProps()}>
            <td className="svg-drags"><DragHandle {...attributes} {...listeners} /></td>
            {isDragging ? (
                <DraggingRow colSpan={row.cells.length}>&nbsp;</DraggingRow>
            ) : (
                row.cells.map((cell, i) => {
                    if (i === 0) {
                        return (
                            <TableData {...cell.getCellProps()} key={i}>
                                
                                <span>{cell.render("Cell")}</span>
                            </TableData>
                        );
                    }
                    return (
                        <TableData {...cell.getCellProps()} key={i}>
                            {cell.render("Cell")}
                        </TableData>
                    );
                })
            )}
        </tr>
    );
};
