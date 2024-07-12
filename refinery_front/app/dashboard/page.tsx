'use client';


import ProtectedRoute from "@/components/protected-route";
import DriverRoutes from "@/components/truck/driver-route";


export default function DashboardPage() {

    return (
        <ProtectedRoute>
            <div>
                <h1 className="text-3xl mb-4">Dashboard - Driver</h1>
                <DriverRoutes />
            </div>
        </ProtectedRoute>
    );
}
