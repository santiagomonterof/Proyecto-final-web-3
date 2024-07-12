'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useAddClientMutation, useUpdateClientMutation, useGetStationsQuery } from '@/lib/features/clientSlice';
import { roleNames } from '@/types';
import { Select, SelectItem } from '@nextui-org/select';

interface ClientFormProps {
    client?: { id: number; username: string; role: string; station: any } | null;
    onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [station, setStation] = useState<number | null>(null);
    const [addClient] = useAddClientMutation();
    const [updateClient] = useUpdateClientMutation();
    const { data: stations = [] } = useGetStationsQuery(null);

    useEffect(() => {
        if (client) {
            setUsername(client.username);
            setRole(client.role);
            setStation(client.station?.id ?? null);
        }
    }, [client]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (client) {
            await updateClient({ id: client.id, username, role, station });
        } else {
            await addClient({ username, password, role, station });
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex justify-center">
            <section className="w-96 flex flex-col gap-4">
                <Input
                    id="username"
                    type="text"
                    label="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                {!client && (
                    <Input
                        id="password"
                        type="password"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                )}
                <Select
                    id="role"
                    value={role}
                    label="Rol"
                    onChange={(e) => setRole(e.target.value)}
                    required
                    placeholder={role ? roleNames[role] : 'Select role'}
                >
                    {Object.entries(roleNames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                            {value}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    id="station"
                    value={Number(station)}
                    label="Rol"
                    onChange={(e) => setStation(Number(e.target.value))}
                    required
                    placeholder={station ? stations.find((s) => s.id === station)?.name : 'Select station'}
                >
                    {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id.toString()}>
                            {station.name}
                        </SelectItem>
                    ))}
                </Select>

                <Button type="submit" color="primary" className="mb-4">{client ? 'Actualizar' : 'Crear'} Cliente</Button>
            </section>
        </form>
    );
};

export default ClientForm;
