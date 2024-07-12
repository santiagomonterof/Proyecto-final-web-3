'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { useUpdatePumpMutation, useDeletePumpFuelMutation, useGetFuelsQuery, useUpdatePumpFuelMutation, useAddPumpFuelMutation } from '@/lib/features/pumpSlice';
import { useSelector } from 'react-redux';

const PumpFormEdit: React.FC<{ pump: any, onClose: () => void }> = ({ pump, onClose }) => {
    const [code, setCode] = useState(pump.code);
    const [selectedFuels, setSelectedFuels] = useState<number[]>(pump.fuels.map((fuel: any) => fuel.fuel.id));
    const [fuelDetails, setFuelDetails] = useState<{ fuelId: number, price: string, stock: string, pumpFuelId?: number }[]>(
        pump.fuels.map((fuel: any) => ({ fuelId: fuel.fuel.id, price: fuel.price, stock: fuel.stock, pumpFuelId: fuel.id }))
    );
    const stationID = useSelector((state: any) => state.auth.user.client.station.id);
    const { data: fuels = [] } = useGetFuelsQuery(null);
    const [updatePump] = useUpdatePumpMutation();
    const [deletePumpFuel] = useDeletePumpFuelMutation();
    const [updatePumpFuel] = useUpdatePumpFuelMutation();
    const [addPumpFuel] = useAddPumpFuelMutation();

    const handleDetailChange = useCallback((index: number, field: string, value: string) => {
        setFuelDetails(prevDetails => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    }, []);

    const handleCheckboxChange = (fuelId: number) => {
        setSelectedFuels(prevSelected => {
            if (prevSelected.includes(fuelId)) {
                const fuelDetail = fuelDetails.find(detail => detail.fuelId === fuelId);
                if (fuelDetail && fuelDetail.pumpFuelId) {
                    deletePumpFuel(fuelDetail.pumpFuelId);
                }
                return prevSelected.filter(id => id !== fuelId);
            } else {
                return [...prevSelected, fuelId];
            }
        });
    };

    useEffect(() => {
        setFuelDetails(selectedFuels.map(fuelId => {
            const existingDetail = fuelDetails.find(detail => detail.fuelId === fuelId);
            return existingDetail || { fuelId, price: '', stock: '' };
        }));
    }, [selectedFuels]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pump.code !== code) {
            await updatePump({ id: pump.id, code, station: stationID }).unwrap();
        }

        for (const fuelDetail of fuelDetails) {
            const existingFuel = pump.fuels.find((fuel: any) => fuel.fuel.id === fuelDetail.fuelId);
            if (!existingFuel && selectedFuels.includes(fuelDetail.fuelId)) {
                await addPumpFuel({
                    pump: pump.id,
                    fuel: fuelDetail.fuelId,
                    price: parseFloat(fuelDetail.price),
                    stock: parseFloat(fuelDetail.stock),
                });
            } else if (existingFuel && selectedFuels.includes(fuelDetail.fuelId) && (existingFuel.price !== fuelDetail.price || existingFuel.stock !== fuelDetail.stock)) {
                await updatePumpFuel({
                    pump: pump.id,
                    fuel: fuelDetail.fuelId,
                    price: parseFloat(fuelDetail.price),
                    stock: parseFloat(fuelDetail.stock),
                });
            }
        }

        onClose();
    };


    return (
        <form onSubmit={handleSubmit} className="flex justify-center">
            <section className="w-96 flex flex-col gap-4">
                <Input
                    label="Code"
                    value={code}
                    isRequired
                    required
                    onChange={(e) => setCode(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                    {fuels.map((fuel) => (
                        <Checkbox
                            key={fuel.id}
                            isSelected={selectedFuels.includes(fuel.id)}
                            onChange={() => handleCheckboxChange(fuel.id)}
                        >
                            {fuel.type}
                        </Checkbox>
                    ))}
                </div>
                {fuelDetails.map((detail, index) => (
                    <div key={detail.fuelId} className="flex flex-col gap-4">
                        <Input
                            label={`Price for ${fuels.find(fuel => fuel.id === detail.fuelId)?.type}`}
                            value={detail.price}
                            isRequired
                            required
                            type="number"
                            onChange={(e) => handleDetailChange(index, 'price', e.target.value)}
                        />
                        <Input
                            label={`Stock for ${fuels.find(fuel => fuel.id === detail.fuelId)?.type}`}
                            value={detail.stock}
                            isRequired
                            required
                            type="number"
                            onChange={(e) => handleDetailChange(index, 'stock', e.target.value)}
                        />
                    </div>
                ))}
                <Button type="submit" color="primary" className="mb-4">Update pump</Button>
            </section>
        </form>
    );
};

export default PumpFormEdit;
