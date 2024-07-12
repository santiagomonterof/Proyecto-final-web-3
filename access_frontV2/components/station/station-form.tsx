'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useAddStationMutation, useUpdateStationMutation } from '@/lib/features/clientSlice';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface StationFormProps {
    station?: { id: number; name: string; latitude: Number; longitude: Number } | null;
    onClose: () => void;
}

const StationForm: React.FC<StationFormProps> = ({ station, onClose }) => {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [addStation] = useAddStationMutation();
    const [updateStation] = useUpdateStationMutation();

    useEffect(() => {
        if (station) {
            setName(station.name);
            setLatitude(Number(station.latitude));
            setLongitude(Number(station.longitude));
        } else {
            setName('');
            setLatitude(0.0);
            setLongitude(0.0);
        }
    }, [station]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (station) {
            await updateStation({ id: station.id, name, latitude, longitude });
        } else {
            await addStation({ name, latitude, longitude });
        }
        onClose();
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            setLatitude(event.latLng.lat());
            setLongitude(event.latLng.lng());
        }
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyB85G7SW_7cFr0CeSSG0NaCtDTJvHDeuOI"
    });

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="flex justify-center">
            <section className="w-96 flex flex-col gap-4">
                <Input
                    id="name"
                    type="text"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <div style={{ height: '400px', width: '100%' }}>
                    <GoogleMap
                        mapContainerStyle={{ height: '100%', width: '100%' }}
                        zoom={10}
                        center={{ lat: latitude, lng: longitude }}
                        onClick={handleMapClick}
                    >
                        <Marker position={{ lat: latitude, lng: longitude }} />
                    </GoogleMap>
                </div>

                <Button type="submit" color="primary" className="mb-4">{station ? 'Actualizar' : 'Crear'} Station</Button>
            </section>
        </form>
    );
};

export default StationForm;
