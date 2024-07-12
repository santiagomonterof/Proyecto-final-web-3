'use client';

import React, { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { useGetTrucksQuery, useAddTruckMutation, useUpdateTruckMutation, useDeleteTruckMutation } from '@/lib/features/refinerySlice';
import TruckForm from './truck-form';

const TruckList: React.FC = () => {
    const { isLoading, data: trucks = [] } = useGetTrucksQuery();
    const [addTruck] = useAddTruckMutation();
    const [updateTruck] = useUpdateTruckMutation();
    const [deleteTruck] = useDeleteTruckMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState<any>(null);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTruck(null);
    };

    const handleEdit = (truck: any) => {
        setSelectedTruck(truck);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this truck?')) {
            await deleteTruck(id);
            alert('Truck deleted successfully');
        }
    };

    const handleSubmit = async (truck: any) => {
        if (selectedTruck) {
            await updateTruck({ ...selectedTruck, ...truck });
        } else {
            await addTruck(truck);
        }
        handleCloseModal();
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <section>
            <div>
                <div className="w-full flex justify-end">
                    <Button className="mb-4" color="primary" variant="bordered" onClick={() => setIsModalOpen(true)}>
                        Create Truck
                    </Button>
                </div>
                <Table aria-label="Truck List">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>License Plate</TableColumn>
                        <TableColumn>Driver ID</TableColumn>
                        <TableColumn className="flex justify-end items-center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {trucks.map((truck) => (
                            <TableRow key={truck.id}>
                                <TableCell>{truck.name}</TableCell>
                                <TableCell>{truck.license_plate}</TableCell>
                                <TableCell>{truck.assigned_driver}</TableCell>
                                <TableCell className="flex justify-end gap-4">
                                    <Button color="default" variant="bordered" onClick={() => handleEdit(truck)}>
                                        Edit
                                    </Button>
                                    <Button color="danger" variant="bordered" onClick={() => handleDelete(truck.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>
                        <h1>{selectedTruck ? 'Edit Truck' : 'Create Truck'}</h1>
                    </ModalHeader>
                    <ModalBody>
                        <TruckForm truck={selectedTruck} onSubmit={handleSubmit} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </section>
    );
};

export default TruckList;
