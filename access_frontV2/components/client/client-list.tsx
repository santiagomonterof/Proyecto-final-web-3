'use client';

import ClientForm from "@/components/client/client-form";
import ProtectedRoute from "@/components/protected-route";
import { useGetClientsQuery, useDeleteClientMutation } from "@/lib/features/clientSlice";
import { roleNames } from "@/types";

import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useState } from "react";

export default function ClientList() {
    const { isLoading, isFetching, data = [], error, refetch } = useGetClientsQuery(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [deleteClient] = useDeleteClientMutation();

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
        refetch();
    };

    const handleEdit = (client: any) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: any) => {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            await deleteClient(id);
            refetch();
            alert('Cliente eliminado exitosamente');
        }
    };

    if (isLoading || isFetching) return <p>Loading...</p>;
    if (error) return <p>Error loading clients:</p>;

    return (
        <section>
            <div>
                <div className="w-full flex justify-end">
                    <Button className="mb-4" color="primary" variant="bordered" onClick={() => setIsModalOpen(true)}>
                        Create client
                    </Button>
                </div>
                <Table aria-label="Client List">
                    <TableHeader>
                        <TableColumn>Username</TableColumn>
                        <TableColumn>Role</TableColumn>
                        <TableColumn>Station</TableColumn>
                        <TableColumn className="flex justify-end items-center">Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.username}</TableCell>
                                <TableCell>{roleNames[client?.role]}</TableCell>
                                <TableCell>{client?.station ? client?.station.name : 'Not assigned'}</TableCell>
                                <TableCell className="flex justify-end gap-4">
                                    <Button color="default" variant="bordered" onClick={() => handleEdit(client)}>
                                        Editar
                                    </Button>
                                    <Button color="danger" variant="bordered" onClick={() => handleDelete(client.id)}>
                                        Eliminar
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
                        <h1>{selectedClient ? 'Editar Cliente' : 'Crear Cliente'}</h1>
                    </ModalHeader>
                    <ModalBody>
                        <ClientForm client={selectedClient} onClose={handleCloseModal} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </section>
    );
}
