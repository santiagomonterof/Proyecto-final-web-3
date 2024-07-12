'use client';

import TruckList from "@/components/truck/truck-list";



export default function DashboardSeller() {
    return (
        <div>
            <div>
                <h1 className="text-3xl mb-4">Dashboard - Admin</h1>
                <TruckList />
            </div>

        </div>
    );
}
