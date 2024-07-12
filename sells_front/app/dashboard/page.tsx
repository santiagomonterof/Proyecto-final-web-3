'use client';

import FuelList from "@/components/fuel/fuel_list";
import ProtectedRoute from "@/components/protected-route";
import PumpList from "@/components/pump/pump-list";
import SalesSummary from "@/components/sells/sales-sumary";
import { useGetPumpsQuery } from "@/lib/features/pumpSlice";
import { Tab, Tabs } from "@nextui-org/tabs";

export default function DashboardPage() {
    const { isLoading, isFetching, error } = useGetPumpsQuery(null);

    if (isLoading || isFetching) return <p>Loading...</p>;
    if (error) return <p>Error loading clients:</p>;

    return (
        <ProtectedRoute>
            <div>
                <h1 className="text-3xl mb-4">Dashboard</h1>
                <div className="flex w-full flex-col">
                    <Tabs aria-label="Options">
                        <Tab key="pumps" title="Pumps">
                            <PumpList />
                        </Tab>
                        <Tab key="fuels" title="Fuels">
                            <FuelList />
                        </Tab>
                        <Tab key="sales" title="Sales Summary">
                            <SalesSummary />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </ProtectedRoute>
    );
}
