import React, { useMemo, useState } from "react";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useTable } from "react-table";
import { DraggableTableRow } from "./DraggableTableRow";
import { StaticTableRow } from "./StaticTableRow";

export function TableData() {
    const [data, setData] = React.useState([
        {
            'id': '1',
            'firstName': 'Deepak',
            'lastName': 'Deepak',
            'age': 'Deepak',
            'visits': 'Deepak',
            'status': 'Deepak',
            'progress': 'progress',
        },
        {
            'id': '2',
            'firstName': 'Deepak 1',
            'lastName': 'Deepak 1',
            'age': 'Deepak',
            'visits': 'Deepak',
            'status': 'Deepak',
            'progress': 'progress',
        },
    ]);
    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                columns: [
                    {
                        Header: "First Name",
                        accessor: "firstName"
                    },
                    {
                        Header: "Last Name",
                        accessor: "lastName"
                    }
                ]
            },
            {
                Header: "Info",
                columns: [
                    {
                        Header: "Age",
                        accessor: "age"
                    },
                    {
                        Header: "Visits",
                        accessor: "visits"
                    },
                    {
                        Header: "Status",
                        accessor: "status",
                        Cell: () => (
                            <button>Delete</button>
                        ),
                    },
                    {
                        Header: "Profile Progress",
                        accessor: "progress"
                    }
                ]
            }
        ],
        []
    );

    const [activeId, setActiveId] = useState();
    const items = useMemo(() => data?.map(({ id }) => id), [data]);
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    });
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setData((data) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    const selectedRow = useMemo(() => {
        if (!activeId) {
            return null;
        }
        const row = rows.find(({ original }) => original.id === activeId);
        prepareRow(row);
        return row;
    }, [activeId, rows, prepareRow]);

    console.log("rows", rows)
    // Render the UI for your table
    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
        >
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <>
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <>
                                        <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                    </>
                                ))}
                            </tr>
                        </>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return <DraggableTableRow key={row.original.id} row={row} />;
                        })}
                    </SortableContext>
                </tbody>
            </table>
            <DragOverlay>
                {activeId && (
                    <table style={{ width: "100%" }}>
                        <tbody>
                            <StaticTableRow row={selectedRow} />
                        </tbody>
                    </table>
                )}
            </DragOverlay>
        </DndContext>
    );
}
