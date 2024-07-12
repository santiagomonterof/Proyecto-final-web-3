'use client';

import React from 'react';
import { useGetRouteStationsQuery, useCompleteRouteStationMutation } from '@/lib/features/refinerySlice';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Button } from '@nextui-org/button';

interface RouteStationListProps {
    routeId: number;
}

const RouteStationList: React.FC<RouteStationListProps> = ({ routeId }) => {
    const { isLoading, data: routeStations = [] } = useGetRouteStationsQuery({ routeId });
    const [completeRouteStation] = useCompleteRouteStationMutation();

    if (isLoading) return <p>Loading...</p>;

    const handleComplete = async (id: number) => {
        await completeRouteStation({ id });
    };

    return (
        <section>
            <Table aria-label="Route Station List">
                <TableHeader>
                    <TableColumn>Station Name</TableColumn>
                    <TableColumn>Fuel to Deliver</TableColumn>
                    <TableColumn>Delivered</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {routeStations.map((routeStation) => (
                        <TableRow key={routeStation.id}>
                            <TableCell>{routeStation.station.name}</TableCell>
                            <TableCell>{routeStation.fuel_to_deliver}</TableCell>
                            <TableCell>{routeStation.delivered ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                {!routeStation.delivered && (
                                    <Button onClick={() => handleComplete(routeStation.id)}>
                                        Mark as Delivered
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
};

export default RouteStationList;
