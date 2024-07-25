'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { useContext } from 'react';
import { ClientsContext } from './clientsModule';
import { Minimize2 } from 'lucide-react';

interface ClientDetailProps {
    onClose: () => void;
}

export const ClientsDetail = ({ onClose }: ClientDetailProps) => {
    const client = useContext(ClientsContext);

    if (!client) {
        return <div>No data available</div>;
    }


    return (
    <>
        <div className="p-4 pg-background">
                <h2 className="mb-2 text-xl font-semibold">Client Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 text-md">Nr</p>
                            <p className="font-semibold text-md">{client.uid || 'N/A'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Number 1</p>
                            <p className="font-semibold text-md">{client.phone_number || 'N/A'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Number 2</p>
                            <p className="font-semibold text-md">{client.cellphone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">Total Balance</p>
                            <p className={`font-semibold text-md ${client.total_balance < 0 ? 'text-red' : ''}`}>
                                {client.total_balance ? `R${client.total_balance}` : 'N/A'}
                            </p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md">{client.client_name || 'N/A'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Enabled</p>
                            <p className="font-semibold text-red">{client.Enabled || 'N/A'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Expiry Date</p>
                            <p className="font-semibold text-md">{new Date(client.expiry_date).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">Support Package</p>
                            <p className={`font-medium text-md text-bold ${client.support_package ? 'text-green' : 'text-red'}`}>
                                {client.support_package || 'NO SUPPORT PACKAGE'}
                            </p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Support No.</p>
                            <p className="font-semibold text-md">
                                {client.LEG_num || 'N/A'}
                            </p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Licenses</p>
                            <p className="font-semibold text-md">{client.Licenses || 'N/A'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Support</p>
                            <p className={`font-semibold text-md ${client.support === 1 ? 'text-green' : client.support === 0 ? 'text-red' : ''}`}>
                                {client.support === 1? 'Yes' : client.support || 'No'}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <Button className="mr-2 bg-orange sm:bg-orange" onClick={onClose}>Close
                            <Minimize2 size={18} strokeWidth={2} className="ml-2"/>
                        </Button>
                    </div>
                </div>
                </div>
    </>
    );
}