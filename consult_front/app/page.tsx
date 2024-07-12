"use client";

import React, { useState, useEffect } from "react";
import { useGetPumpsWithFuelsQuery } from "@/lib/features/pumpSlice";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Select, SelectItem  } from '@nextui-org/select';
import { Card, CardBody, CardHeader } from "@nextui-org/card";

const GOOGLE_MAPS_API_KEY = "AIzaSyB85G7SW_7cFr0CeSSG0NaCtDTJvHDeuOI";

const Home = () => {
  const { data: pumps, error, isLoading } = useGetPumpsWithFuelsQuery();
  const [selectedFuel, setSelectedFuel] = useState<string>("");
  const [filteredPumps, setFilteredPumps] = useState<typeof pumps>([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!isLoading && pumps) {
      setFilteredPumps(pumps);
    }
  }, [isLoading, pumps]);

  const handleFuelChange = (value: string) => {
    setSelectedFuel(value);

    if (value === "") {
      setFilteredPumps(pumps);
    } else {
      const filtered = pumps?.filter((pump) =>
        pump.fuels.some((fuel) => fuel.fuel.type === value)
      );
      setFilteredPumps(filtered || []);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading pumps data.</p>;

  const uniqueFuelTypes = Array.from(
    new Set(pumps?.flatMap((pump) => pump.fuels.map((fuel) => fuel.fuel.type)))
  );

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-3xl font-bold text-center">
        Consultar Combustible Disponible
      </h1>
      <div className="flex justify-center my-4">
        <Select
          value={selectedFuel}
          onChange={(e: any) => handleFuelChange(e.target.value)}
          placeholder="Tipo de Combustible"
        >
          {uniqueFuelTypes.map((fuelType) => (
            <SelectItem key={fuelType} value={fuelType}>
              {fuelType}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {filteredPumps?.map((pump) => (
          <Card key={pump.id} className="w-80 bg-white shadow-md p-4">
            <CardHeader>
              <h3 >{pump.station.name}</h3>
            </CardHeader>
            <CardBody>
              {isLoaded && (
                <div style={{ height: "200px", width: "100%" }}>
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    zoom={15}
                    center={{ lat: pump.station.latitude, lng: pump.station.longitude }}
                  >
                    <Marker position={{ lat: pump.station.latitude, lng: pump.station.longitude }} />
                  </GoogleMap>
                </div>
              )}
              <h1>
                <strong>Stock Disponible:</strong> {pump.fuels.reduce((acc, fuel) => acc + parseFloat(fuel.stock), 0)} lt
              </h1>
              <h1>
                <strong>Precio:</strong> {pump.fuels[0]?.price} Bs
              </h1>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Home;
