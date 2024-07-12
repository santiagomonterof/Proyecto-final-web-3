'use client';

import SalesList from "@/components/sells/sale-list";



export default function DashboardSeller() {
    return (
        <div>
            <h1 className="text-3xl mb-4">Dashboard - Seller</h1>
            <SalesList />
        </div>
    );
}
