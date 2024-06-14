// src/TonConnectProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TonConnectUI, Wallet } from '@tonconnect/ui-react';

interface TonConnectContextType {
    tonConnectUI: TonConnectUI | null;
    wallet: Wallet | null;
}

const TonConnectContext = createContext<TonConnectContextType | null>(null);

let tonConnectUIInstance: TonConnectUI | null = null;

export const useTonConnect = (): TonConnectContextType => {
    const context = useContext(TonConnectContext);
    if (!context) {
        throw new Error('useTonConnect must be used within a TonConnectProvider');
    }
    return context;
};

interface TonConnectProviderProps {
    children: ReactNode;
}

export const TonConnectProvider: React.FC<TonConnectProviderProps> = ({ children }) => {
    const [wallet, setWallet] = useState<Wallet | null>(null);

    useEffect(() => {
        if (!tonConnectUIInstance) {
            console.log('Initializing TonConnectUI instance');
            tonConnectUIInstance = new TonConnectUI({
                manifestUrl: 'https://raw.githubusercontent.com/vanhauhoang/whisk-metadata/main/wheel-metadata.json',
            });

            tonConnectUIInstance.onStatusChange((wallet) => {
                console.log('Wallet status changed:', wallet);
                setWallet(wallet);
            });
        }

        // return () => {
        //     if (tonConnectUIInstance) {
        //         console.log('Disconnecting TonConnectUI instance');
        //         tonConnectUIInstance.disconnect();
        //     }
        // };
    }, []);

    return (
        <TonConnectContext.Provider value={{ tonConnectUI: tonConnectUIInstance, wallet }}>
            {children}
        </TonConnectContext.Provider>
    );
};

