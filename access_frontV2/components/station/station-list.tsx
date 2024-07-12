'use client';

import { useDeleteStationMutation, useGetStationsQuery } from "@/lib/features/clientSlice";

import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useState } from "react";
import StationForm from "./station-form";

export default function StationList() {
    const { isLoading, isFetching, data = [], error, refetch } = useGetStationsQuery(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState(null);
    const [deleteStation] = useDeleteStationMutation();

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStation(null);
        refetch();
    };

    const handleEdit = (station: any) => {
        setSelectedStation(station);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: any) => {
        if (confirm('Are you sure you want to delete this station?')) {
            await deleteStation(id);
            alert('Client deleted successfully');
        }
    };

    if (isLoading || isFetching) return <p>Loading...</p>;
    if (error) return <p>Error loading clients:</p>;

    return (
        <section>
            <div>
                <div className="w-full flex justify-end">
                    <Button className="mb-4" color="primary" variant="bordered" onClick={() => setIsModalOpen(true)}>
                        Create station
                    </Button>
                </div>
                <Table aria-label="Client List">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Longitude</TableColumn>
                        <TableColumn>Latitude</TableColumn>
                        <TableColumn className="flex justify-end items-center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.map((station) => (
                            <TableRow key={station.id}>
                                <TableCell>{station.name}</TableCell>
                                <TableCell>{station.longitude}</TableCell>
                                <TableCell>{station.latitude}</TableCell>
                                <TableCell className="flex justify-end gap-4">
                                    <Button color="default" variant="bordered" onClick={() => handleEdit(station)}>
                                        Edit
                                    </Button>
                                    <Button color="danger" variant="bordered" onClick={() => handleDelete(station.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            >
                <ModalContent>
                    <ModalHeader>
                        <h1>{selectedStation ? 'Edit station' : 'Create station'}</h1>
                    </ModalHeader>
                    <ModalBody>
                        <StationForm station={selectedStation} onClose={handleCloseModal} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </section>
    );
}
