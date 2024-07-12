'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { useDeleteSaleMutation, useGetSalesQuery } from '@/lib/features/saleSlice';
import SellForm from './sale-form';


export default function SalesList() {
    const { isLoading, isFetching, data = [], error, refetch } = useGetSalesQuery({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSale(null);
        refetch();
    };


    if (isLoading || isFetching) return <p>Loading...</p>;
    if (error) return <p>Error loading sales:</p>;

    return (
        <section>
            <div>
                <div className="w-full flex justify-end">
                    <Button className="mb-4" color="primary" variant="bordered" onClick={() => {
                        setSelectedSale(null);
                        setIsModalOpen(true);
                    }}>
                        Create sale
                    </Button>
                </div>
                <Table aria-label="Sales List">
                    <TableHeader>
                        <TableColumn>ID</TableColumn>
                        <TableColumn>Invoice Name</TableColumn>
                        <TableColumn>Invoice NIT</TableColumn>
                        <TableColumn>Client</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Amount</TableColumn>
                        <TableColumn>Product Price</TableColumn>
                        <TableColumn>Quantity (Liters)</TableColumn>
                        <TableColumn>Date</TableColumn>
                        <TableColumn>Pump</TableColumn>
                        <TableColumn>Fuel</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.map((sale: any) => (
                            <TableRow key={sale.id}>
                                <TableCell>{sale.id}</TableCell>
                                <TableCell>{sale.invoice_name}</TableCell>
                                <TableCell>{sale.invoice_nit}</TableCell>
                                <TableCell>{sale.client}</TableCell>
                                <TableCell>{sale.email}</TableCell>
                                <TableCell>{sale.amount}</TableCell>
                                <TableCell>{sale.product_price}</TableCell>
                                <TableCell>{sale.quantity_liters}</TableCell>
                                <TableCell>{new Date(sale.date_time).toLocaleDateString()}</TableCell>
                                <TableCell>{sale.pump}</TableCell>
                                <TableCell>{sale.product_type}</TableCell>
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
                        <h1>{selectedSale ? 'Edit sale' : 'Create sale'}</h1>
                    </ModalHeader>
                    <ModalBody>
                        <SellForm sale={selectedSale} onClose={handleCloseModal} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </section>
    );
}
