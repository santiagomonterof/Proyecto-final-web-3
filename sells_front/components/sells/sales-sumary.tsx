'use client';

import React, { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { useGetSalesQuery, useUpdateSaleMutation } from '@/lib/features/saleSlice';

const SalesSummary = () => {
    const { isLoading, isFetching, data = [], error, refetch } = useGetSalesQuery({});
    const [updateSale] = useUpdateSaleMutation();

    const handleAnnullSale = async (sale: any) => {
        if (confirm('Are you sure you want to annul this sale?')) {
            await updateSale({ id: sale.id, is_annulled: true });
            alert('Sale annulled successfully');
        }
    };

    if (isLoading || isFetching) return <p>Loading...</p>;
    if (error) return <p>Error loading sales:</p>;

    return (
        <Table aria-label="Sales Summary">
            <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Invoice Name</TableColumn>
                <TableColumn>Client</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn className="flex justify-end items-center">Actions</TableColumn>
            </TableHeader>
            <TableBody>
                {data.map((sale: any) => (
                    <TableRow key={sale.id}>
                        <TableCell>{sale.id}</TableCell>
                        <TableCell>{sale.invoice_name}</TableCell>
                        <TableCell>{sale.client}</TableCell>
                        <TableCell>{sale.amount}</TableCell>
                        <TableCell>{new Date(sale.date_time).toLocaleDateString()}</TableCell>
                        <TableCell>{sale.is_annulled ? 'Annulled' : 'Active'}</TableCell>
                        <TableCell className="flex justify-end gap-4">
                            {!sale.is_annulled && (
                                <Button color="danger" variant="bordered" onClick={() => handleAnnullSale(sale)}>
                                    Annul
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default SalesSummary;
