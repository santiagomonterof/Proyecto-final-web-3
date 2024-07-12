'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';

interface TruckFormProps {
    truck?: { id?: number; name: string; license_plate: string; assigned_driver: string | null } | null;
    onSubmit: (truck: { name: string; license_plate: string; assigned_driver: string | null }) => void;
}

const TruckForm: React.FC<TruckFormProps> = ({ truck, onSubmit }) => {
    const [name, setName] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [assignedDriver, setAssignedDriver] = useState<string | null>(null);

    useEffect(() => {
        if (truck) {
            setName(truck.name);
            setLicensePlate(truck.license_plate);
            setAssignedDriver(truck.assigned_driver);
        }
    }, [truck]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, license_plate: licensePlate, assigned_driver: assignedDriver });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <Input
                label="License Plate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                required
            />
            <Input
                label="Driver ID"
                value={assignedDriver || ''}
                onChange={(e) => setAssignedDriver(e.target.value)}
                required
            />
            <Button type="submit" color="primary">
                {truck ? 'Update Truck' : 'Create Truck'}
            </Button>
        </form>
    );
};

export default TruckForm;
