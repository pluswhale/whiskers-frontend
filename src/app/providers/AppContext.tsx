import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import { loginUser, referralUser, spinWheelByUser } from '../../shared/api/user/thunks';
import { useMediaQuery } from 'react-responsive';
import { removeAllCookies } from '../../shared/libs/cookies';
import { parseUriParamsLine } from '../../shared/utils/parseUriParams';
import { WHEEL_SPINNING_SECONDS } from '../../shared/libs/constants';

import { TonClient, Address, JettonMaster, fromNano } from "@ton/ton";
import { JettonWallet } from '../../contracts/JettonWallet';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { NETWORK, JETTON_MINTER_ADDRESS } from '../../contracts/config';

//@ts-ignore
const tg: any = window?.Telegram?.WebApp;

export interface UserData {
    bonusSpins: number;
    createdAt: string;
    referralCode: string;
    referredBy: null | any;
    referredUsers: any[];
    spinsAvailable: number;
    points: number;
    unclaimedWhisks: number;
    userTonAddress: string;
    updatedAt: string;
    lastSpinTime: string[];
    userId: string;
    __v: number;
    _id: string;
}

export interface TelegramUserData {
    allows_write_to_pm: boolean;
    first_name: string;
    id: number;
    is_premium: boolean;
    language_code: string;
    last_name: string;
    username: string;
}

interface AppContextType {
    userData: UserData | null;
    isFreeSpins: boolean | null;
    isMobile: boolean;
    isAvailableToSpin: boolean;
    tgUser: TelegramUserData | null;
    updateFreeSpins: () => void;
    updateUnclaimedWhisks: () => void;
    updateBonusSpins: (countSpins?: number) => void;
    updateTempWinScore: (score: number) => void;
    jettonBalance: number;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

export const AppContextProvider: React.FC<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const [tgUser, setTgUser] = useState<TelegramUserData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setIsLoading] = useState<boolean>(true);
    const [isFreeSpins, setIsFreeSpins] = useState<boolean | null>(false);
    const [isAvailableToSpin, setIsAvailableToSpin] = useState<boolean>(false);
    const [isAppLoaded, setIsAppLoaded] = useState<boolean>(false);
    const uriParams = parseUriParamsLine(window.location.href?.split('?')?.[1]);
    const [jettonBalance, setJettonBalance] = useState<number>(0);

    useEffect(() => {
        return () => {
            onExitFromApp();
        };
    }, []);

    useEffect(() => {
        //@ts-ignore
        if (window.Telegram && window.Telegram.WebApp) {
            //@ts-ignore
            tg.ready();
            // Get user data from the Telegram Web App context
            const user = tg.initDataUnsafe.user;
            setTgUser(user);
        } else {
            console.error('Telegram WebApp is not initialized or running outside of Telegram context.');
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await loginUser(tgUser?.id?.toString() || '1559803968'); //574813379
                if (res) {
                    console.log('res: ', res);
                    setUserData(res.user);
                    if (uriParams?.tgWebAppStartParam) {
                        await referralUser(res.user.userId, {
                            referredById: uriParams?.tgWebAppStartParam?.split('#')?.[0],
                        });
                    }
                }
                console.log('userData: ', userData);
            } catch (error) {
                console.error('Error during login:', error);
            }
        };

        fetchUserData();
    }, [tgUser?.id, uriParams?.startapp]);

    useEffect(() => {
        //@ts-ignore
        if (userData?.bonusSpins > 0) {
            setIsFreeSpins(false);
            setIsAvailableToSpin(true);
            //@ts-ignore
        } else if (userData?.spinsAvailable > 0) {
            setIsFreeSpins(true);
            setIsAvailableToSpin(true);
        } else {
            setIsFreeSpins(null);
            setIsAvailableToSpin(false);
        }

        setTimeout(() => {
            setIsAppLoaded(true);
            setIsLoading(false);
        }, 4000);
    }, [userData?.spinsAvailable, userData?.bonusSpins]);

    // fetch WHISK balance
    useEffect(() => {
        const fetchBalance = async () => {
            const endpoint = await getHttpEndpoint({ network: NETWORK });
            const client = new TonClient({ endpoint });
            const minter = new JettonMaster(Address.parse(JETTON_MINTER_ADDRESS));
            const minterContract = client.open(minter);

            if (userData?.userTonAddress) {
                const jettonWalletAddress = await minterContract.getWalletAddress(Address.parse(userData?.userTonAddress));
                const userJettonWallet = new JettonWallet(jettonWalletAddress);
                const userJettonWalletContract = client.open(userJettonWallet);
                const whiskBalance = await userJettonWalletContract.getJettonBalance();
                setJettonBalance(Number(fromNano(whiskBalance)));
            } else {
                setJettonBalance(0);
            }
        };
        fetchBalance();
    }, [userData?.userTonAddress]);

    if (loading && !isAppLoaded) {
        return <LoaderScreen />;
    }

    // Actions
    const updateTempWinScore = (score: number) => {
        if (userData?.userId) {
            spinWheelByUser(userData?.userId, {
                winScore: score,
                isFreeSpin: isFreeSpins,
            }).then((res) => {
                if (res && res.status && res?.status === 200) {
                    setTimeout(() => {
                        setUserData((prevUserData: any) => ({
                            ...prevUserData,
                            points: prevUserData.points + score,
                            unclaimedWhisks: prevUserData.unclaimedWhisks + score,
                        }));
                    }, WHEEL_SPINNING_SECONDS);
                }
            });
        }
    };

    const updateFreeSpins = () => {
        if (userData) {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                spinsAvailable: prevUserData.spinsAvailable > 0 ? prevUserData.spinsAvailable - 1 : 0,
            }));
        }
    };

    const updateBonusSpins = (countSpins?: number) => {
        if (countSpins) {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                bonusSpins: (prevUserData.bonusSpins += countSpins),
            }));
        } else {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                bonusSpins: prevUserData.bonusSpins - 1,
            }));
        }
    };

    const updateUnclaimedWhisks = () => {
        setUserData((prevUserData: any) => ({
            ...prevUserData,
            points: 0,
            unclaimedWhisks: 0,
        }));
    };

    function onExitFromApp() {
        removeAllCookies();
        tg.close();
    }

    return (
        <AppContext.Provider
            value={{
                tgUser,
                userData,
                isFreeSpins,
                isAvailableToSpin,
                isMobile,
                updateTempWinScore,
                updateFreeSpins,
                updateBonusSpins,
                updateUnclaimedWhisks,
                jettonBalance
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

