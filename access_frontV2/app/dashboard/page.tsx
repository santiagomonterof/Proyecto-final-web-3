'use client';

import ClientList from "@/components/client/client-list";
import ProtectedRoute from "@/components/protected-route";
import StationList from "@/components/station/station-list";
import { useGetClientsQuery } from "@/lib/features/clientSlice";
import { Tab, Tabs } from "@nextui-org/tabs";

export default function DashboardPage() {
    const { isLoading, isFetching, error } = useGetClientsQuery(null);

    if (isLoading || isFetching) return <p>Loading...</p>;
    if (error) return <p>Error loading clients:</p>;

    return (
        <ProtectedRoute>
            <div>
                <h1 className="text-3xl mb-4">Dashboard</h1>
                <div className="flex w-full flex-col">
                    <Tabs aria-label="Options">
                        <Tab key="clients" title="Clients">
                            <ClientList />
                        </Tab>
                        <Tab key="stations" title="Stations">
                            <StationList />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </ProtectedRoute>
    );
}
