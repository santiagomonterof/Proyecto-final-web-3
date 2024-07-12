'use client';

import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useState } from "react";

import { useDeletePumpMutation, useGetPumpsWithTypesFuelByStationQuery } from "@/lib/features/pumpSlice";
import { useSelector } from "react-redux";
import PumpFormEdit from "./pump_form_edit";
import PumpFormAdd from "./pump_form_add";

export default function PumpList() {
    const stationId = useSelector((state: any) => state.auth.user.client.station.id);
    const { isLoading, isFetching, data = [], error, refetch } = useGetPumpsWithTypesFuelByStationQuery(stationId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPump, setSelectedPump] = useState(null);
    const [deletePump] = useDeletePumpMutation();

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPump(null);
        refetch();
    };

    const handleEdit = (pump: any) => {
        setSelectedPump(pump);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: any) => {
        if (confirm('Are you sure you want to delete this pump?')) {
            await deletePump(id);
            alert('Pump deleted successfully');
        }
    };

    if (isLoading || isFetching) return <p>Loading...</p>;
    if (error) return <p>Error loading pumps:</p>;

    return (
        <section>
            <div>
                <div className="w-full flex justify-end">
                    <Button className="mb-4" color="primary" variant="bordered" onClick={() => {
                        setSelectedPump(null);
                        setIsModalOpen(true);
                    }}>
                        Create pump
                    </Button>
                </div>
                <Table aria-label="Pump List">
                    <TableHeader>
                        <TableColumn>Code</TableColumn>
                        <TableColumn>Fuels</TableColumn>
                        <TableColumn className="flex justify-end items-center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.map((pump) => (
                            <TableRow key={pump.id}>
                                <TableCell>{pump.code}</TableCell>
                                <TableCell>
                                    {pump.fuels.length > 0 ? (
                                        <ul>
                                            {pump.fuels.map((fuel) => (
                                                <li key={fuel.fuel.id}>
                                                    {fuel.fuel.type} - Price: {fuel.price} - Stock: {fuel.stock}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>No fuels available</span>
                                    )}
                                </TableCell>
                                <TableCell className="flex justify-end gap-4">
                                    <Button color="default" variant="bordered" onClick={() => handleEdit(pump)}>
                                        Edit
                                    </Button>
                                    <Button color="danger" variant="bordered" onClick={() => handleDelete(pump.id)}>
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
                        <h1>{selectedPump ? 'Edit pump' : 'Create pump'}</h1>
                    </ModalHeader>
                    <ModalBody>
                        {selectedPump ? (
                            <PumpFormEdit pump={selectedPump} onClose={handleCloseModal} />
                        ) : (
                            <PumpFormAdd onClose={handleCloseModal} />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </section>
    );
}
