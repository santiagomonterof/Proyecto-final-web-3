'use client';

import React from 'react';
import { useGetDriverRoutesQuery } from '@/lib/features/refinerySlice';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Button } from '@nextui-org/button';

const DriverRoutes: React.FC = () => {
    const driverId = useSelector((state: any) => state.auth.user.id);
    const { isLoading, data: routes = [] } = useGetDriverRoutesQuery({ driverId });

    if (isLoading) return <p>Loading...</p>;

    return (
        <section>
            <Table aria-label="Driver Routes">
                <TableHeader>
                    <TableColumn>Route Name</TableColumn>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Truck</TableColumn>
                    <TableColumn>Fuel Type</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {routes.map((route) => (
                        <TableRow key={route.id}>
                            <TableCell>{route.name}</TableCell>
                            <TableCell>{route.date}</TableCell>
                            <TableCell>{route.truck.name}</TableCell>
                            <TableCell>{route.fuel_type.name}</TableCell>
                            <TableCell>
                                <Button as="a" href={`https://maps.google.com/?q=${route.truck.latitude},${route.truck.longitude}`} target="_blank" rel="noopener noreferrer">
                                    Open in Maps
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
};

export default DriverRoutes;
