'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useGetFuelsQuery, useGetPumpsQuery } from '@/lib/features/pumpSlice';
import { useAddSaleMutation, useUpdateSaleMutation } from '@/lib/features/saleSlice';


const SellForm: React.FC<{ sale?: any, onClose: () => void }> = ({ sale, onClose }) => {
    const [invoiceName, setInvoiceName] = useState(sale?.invoice_name || '');
    const [invoiceNit, setInvoiceNit] = useState(sale?.invoice_nit || '');
    const [client, setClient] = useState(sale?.client || '');
    const [email, setEmail] = useState(sale?.email || '');
    const [amount, setAmount] = useState(sale?.amount || '');
    const [productPrice, setProductPrice] = useState(sale?.product_price || '');
    const [dateTime, setDateTime] = useState(sale ? new Date(sale.date_time).toISOString().substring(0, 16) : '');
    const [pump, setPump] = useState(sale?.pump || '');
    const [fuel, setFuel] = useState(sale?.product_type || '');
    const [quantityLiters, setQuantityLiters] = useState(sale?.quantity_liters || '');

    const { data: pumps = [] } = useGetPumpsQuery(null);
    const { data: fuels = [] } = useGetFuelsQuery(null);
    const [addSale] = useAddSaleMutation();
    const [updateSale] = useUpdateSaleMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const saleData = {
            invoice_name: invoiceName,
            invoice_nit: invoiceNit,
            client,
            email,
            amount: parseFloat(amount),
            product_price: parseFloat(productPrice),
            date_time: new Date(dateTime).toISOString(),
            pump,
            product_type: fuel,
            quantity_liters: parseFloat(quantityLiters)
        };

        if (sale) {
            await updateSale({ id: sale.id, ...saleData });
        } else {
            await addSale(saleData);
        }

        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex justify-center">
            <section className="w-96 flex flex-col gap-4">
                <Input
                    label="Invoice Name"
                    value={invoiceName}
                    isRequired
                    required
                    onChange={(e) => setInvoiceName(e.target.value)}
                />
                <Input
                    label="Invoice NIT"
                    value={invoiceNit}
                    isRequired
                    required
                    onChange={(e) => setInvoiceNit(e.target.value)}
                />
                <Input
                    label="Client"
                    value={client}
                    isRequired
                    required
                    onChange={(e) => setClient(e.target.value)}
                />
                <Input
                    label="Email"
                    value={email}
                    isRequired
                    required
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    label="Amount"
                    value={amount}
                    isRequired
                    required
                    type="number"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <Input
                    label="Product Price"
                    value={productPrice}
                    isRequired
                    required
                    type="number"
                    onChange={(e) => setProductPrice(e.target.value)}
                />
                <Input
                    label="Date"
                    value={dateTime}
                    isRequired
                    required
                    type="datetime-local"
                    onChange={(e) => setDateTime(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                    <label>Pump</label>
                    <select value={pump} onChange={(e) => setPump(e.target.value)} required>
                        <option value="">Select Pump</option>
                        {pumps.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.code}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label>Fuel</label>
                    <select value={fuel} onChange={(e) => setFuel(e.target.value)} required>
                        <option value="">Select Fuel</option>
                        {fuels.map((f: any) => (
                            <option key={f.id} value={f.id}>{f.type}</option>
                        ))}
                    </select>
                </div>
                <Input
                    label="Quantity (Liters)"
                    value={quantityLiters}
                    isRequired
                    required
                    type="number"
                    onChange={(e) => setQuantityLiters(e.target.value)}
                />
                <Button type="submit" color="primary" className="mb-4">
                    {sale ? 'Update Sale' : 'Create Sale'}
                </Button>
            </section>
        </form>
    );
};

export default SellForm;
