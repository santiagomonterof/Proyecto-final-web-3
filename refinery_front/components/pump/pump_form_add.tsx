'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { useAddPumpMutation, useGetFuelsQuery, useAddPumpFuelMutation } from '@/lib/features/pumpSlice';
import { useSelector } from 'react-redux';

const PumpFormAdd: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [code, setCode] = useState('');
    const [selectedFuels, setSelectedFuels] = useState<number[]>([]);
    const [fuelDetails, setFuelDetails] = useState<{ fuelId: number, price: string, stock: string }[]>([]);
    const stationID = useSelector((state: any) => state.auth.user.client.station.id);
    const { data: fuels = [] } = useGetFuelsQuery(null);
    const [addPump] = useAddPumpMutation();
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
        const newPump = await addPump({ code, station: stationID }).unwrap();
        const pumpId = newPump.id;

        for (const fuelDetail of fuelDetails) {
            await addPumpFuel({
                pump: Number(pumpId),
                fuel: fuelDetail.fuelId,
                price: parseFloat(fuelDetail.price),
                stock: parseFloat(fuelDetail.stock),
            });
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
                <Button type="submit" color="primary" className="mb-4">Create pump</Button>
            </section>
        </form>
    );
};

export default PumpFormAdd;
