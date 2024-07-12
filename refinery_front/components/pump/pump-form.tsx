'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { useAddPumpMutation, useUpdatePumpMutation, useGetFuelsQuery, useAddPumpFuelMutation, useUpdatePumpFuelMutation, useDeletePumpFuelMutation } from '@/lib/features/pumpSlice';
import { useSelector } from 'react-redux';

interface PumpFormProps {
    pump?: {
        fuels: { fuel: { id: number, type: string }, id: number, price: string, stock: string }[]; id: number; code: string; station: any;
    } | null;
    onClose: () => void;
}

const PumpForm: React.FC<PumpFormProps> = ({ pump, onClose }) => {
    const [code, setCode] = useState('');
    const [selectedFuels, setSelectedFuels] = useState<number[]>([]);
    const [fuelDetails, setFuelDetails] = useState<{ id?: number, fuelId: number, price: string, stock: string }[]>([]);
    const stationID = useSelector((state: any) => state.auth.user.client.station.id);
    const { data: fuels = [], isLoading: isLoadingFuels } = useGetFuelsQuery(null);
    const [addPump] = useAddPumpMutation();
    const [updatePump] = useUpdatePumpMutation();
    const [addPumpFuel] = useAddPumpFuelMutation();
    const [updatePumpFuel] = useUpdatePumpFuelMutation();
    const [deletePumpFuel] = useDeletePumpFuelMutation();

    useEffect(() => {
        if (pump) {
            setCode(pump.code);
            const selectedFuels = pump.fuels.map(fuel => fuel.fuel.id);
            setSelectedFuels(selectedFuels);
            setFuelDetails(pump.fuels.map(fuel => ({
                id: fuel.id,
                fuelId: fuel.fuel.id,
                price: fuel.price,
                stock: fuel.stock
            })));
        } else {
            setCode('');
            setSelectedFuels([]);
            setFuelDetails([]);
        }
    }, [pump]);

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
        let pumpId: number | undefined;

        if (pump) {
            const updatedPump = await updatePump({ id: pump.id, code, station: stationID }).unwrap();
            pumpId = updatedPump.id;
        } else {
            const newPump = await addPump({ code, station: stationID }).unwrap();
            pumpId = newPump.id;
        }

        if (pumpId) {
            const existingFuelIds = pump ? pump.fuels.map(fuel => fuel.fuel.id) : [];
            const fuelsToDelete = existingFuelIds.filter(id => !selectedFuels.includes(id));
            const fuelsToAdd = selectedFuels.filter(id => !existingFuelIds.includes(id));
            const fuelsToUpdate = fuelDetails.filter(detail => existingFuelIds.includes(detail.fuelId));

            // Eliminar combustibles deseleccionados
            for (const fuelId of fuelsToDelete) {
                const pumpFuelId = pump?.fuels.find(f => f.fuel.id === fuelId)?.id;
                if (pumpFuelId) {
                    await deletePumpFuel(pumpFuelId);
                }
            }

            // Agregar nuevos combustibles seleccionados
            for (const fuelId of fuelsToAdd) {
                const newFuelDetail = fuelDetails.find(d => d.fuelId === fuelId);
                if (newFuelDetail) {
                    await addPumpFuel({
                        pump: pumpId,
                        fuel: newFuelDetail.fuelId,
                        price: parseFloat(newFuelDetail.price),
                        stock: parseFloat(newFuelDetail.stock),
                    });
                }
            }

            // Actualizar combustibles existentes
            for (const detail of fuelsToUpdate) {
                const pumpFuelId = pump?.fuels.find(f => f.fuel.id === detail.fuelId)?.id;
                const existingDetail = pump?.fuels.find(f => f.fuel.id === detail.fuelId);
                if (pumpFuelId && (existingDetail?.price !== detail.price || existingDetail?.stock !== detail.stock)) {
                    await updatePumpFuel({
                        pump: pumpId,
                        fuel: detail.fuelId,
                        price: parseFloat(detail.price),
                        stock: parseFloat(detail.stock),
                    });
                }
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
                <Button type="submit" color="primary" className="mb-4">{pump ? 'Update' : 'Create'} pump</Button>
            </section>
        </form>
    );
};

export default PumpForm;
