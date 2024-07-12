'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useGetFuelsQuery } from '@/lib/features/pumpSlice';

const FuelList: React.FC = () => {
    const { data: fuels = [], isLoading, error } = useGetFuelsQuery(null);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching fuels</div>;
    }

    return (
        <div>
            <h1>Fuel Types</h1>
            <Table aria-label="Fuel Types List">
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>Type</TableColumn>
                </TableHeader>
                <TableBody>
                    {fuels.map((fuel) => (
                        <TableRow key={fuel.id}>
                            <TableCell>{fuel.id}</TableCell>
                            <TableCell>{fuel.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default FuelList;
