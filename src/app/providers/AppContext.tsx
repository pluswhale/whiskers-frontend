/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import { loginUser, referralUser, fetchSnapshotInfo, fetchAirdropList } from '../../shared/api/user/thunks';
import { useMediaQuery } from 'react-responsive';
import { removeAllCookies } from '../../shared/libs/cookies';
import { parseUriParamsLine } from '../../shared/utils/parseUriParams';
import DeviceCheckingScreen from '../../features/device-checking-screen/DeviceCheckingScreen';
import MobileDetect from 'mobile-detect';

import { TonClient, Address, JettonMaster, fromNano } from '@ton/ton';
import { JettonWallet } from '../../contracts/JettonWallet';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { NETWORK, JETTON_MINTER_ADDRESS } from '../../contracts/config';

const testUserId = '849293092';

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
    claimedWhisks: number;
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
    updateBonusSpins: (countSpins?: number) => void;
    updateTempWinScore: (score: number, delay: number) => void;
    updateClaimedWhisks: () => void;
    jettonBalance: number;
    isClaimable: number | null;
    airdropCell: string | null;
    campaignNumber: number | null;
    airdropList: any[];
}

const fetchAndUpdateUserData = async (userId: string, setUserData: (user: UserData) => void) => {
    try {
        const res = await loginUser(userId); // Adjust the endpoint and method as needed
        if (res) {
            //@ts-ignore
            setUserData((prev: UserData): UserData => {
                return { ...prev, lastSpinTime: res?.user?.lastSpinTime };
            });
            // Assume the backend handles spin recharging
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

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
    const [isClaimable, setIsClaimable] = useState<number | null>(0);
    const [airdropCell, setAirdropCell] = useState<string | null>('');
    const [campaignNumber, setCampaignNumber] = useState<number | null>(0);
    const [airdropList, setAirdropList] = useState<any[]>([]);
    const userAgent = navigator.userAgent;
    const md = new MobileDetect(userAgent);
    const isMobileDevice = md.mobile() !== null || md.tablet() !== null;
    const isTelegramWebApp = userAgent.includes('Telegram');

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
            const userId = tgUser?.id?.toString() || '849293092';

            if (!userId) return;

            try {
                const res = await loginUser(userId || testUserId);

                if (res && res?.user) {
                    setUserData(res.user);

                    if (uriParams?.tgWebAppStartParam) {
                        await referralUser(res.user.userId, {
                            referredById: uriParams.tgWebAppStartParam.split('#')[0],
                        });
                    }
                }
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
                const jettonWalletAddress = await minterContract.getWalletAddress(
                    Address.parse(userData?.userTonAddress),
                );
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

    // fetch snapshot info
    useEffect(() => {
        const fetchSnapshot = async () => {
            try {
                const res = await fetchSnapshotInfo();
                if (res) {
                    setIsClaimable(res[0].isClaimable);
                    setAirdropCell(res[0].airdropCell);
                    setCampaignNumber(res[0].campaignNumber);
                }
            } catch (err) {
                console.error('Fetching snapshot error: ', err);
            }
        };
        fetchSnapshot();
    }, []);

    // fetch airdrop list
    useEffect(() => {
        const fetchAirdrop = async () => {
            try {
                const res = await fetchAirdropList();
                if (res) {
                    setAirdropList(res);
                }
            } catch (err) {
                console.error('Fetching airdrop list failed: ', err);
            }
        };
        fetchAirdrop();
    }, []);

    useEffect(() => {
        if (userData && userData?.lastSpinTime?.length >= 0) {
            const checkSpinTimes = () => {
                if (!tgUser?.id?.toString()) return;

                const now = new Date();

                userData.lastSpinTime.forEach(async (spinTime) => {
                    if (new Date(spinTime) <= now) {
                        await fetchAndUpdateUserData(tgUser?.id?.toString() || testUserId, setUserData);
                    }
                });
            };

            const interval = setInterval(checkSpinTimes, 1000);

            return () => clearInterval(interval);
        }
    }, [tgUser?.id, userData?.lastSpinTime]);

    if (!isMobileDevice || isTelegramWebApp) {
        return <DeviceCheckingScreen />;
    }

    if (loading && !isAppLoaded) {
        return <LoaderScreen />;
    }

    // Actions
    const updateTempWinScore = async (score: number, delay: number) => {
        const userId = tgUser?.id?.toString();

        if (userId) {
            await fetchAndUpdateUserData(userId, setUserData);
        }
        setTimeout(() => {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                points: prevUserData.points + score,
            }));
        }, delay); // because a little delay in animation
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

    const updateClaimedWhisks = () => {
        const fetchUserData = async () => {
            const userId = tgUser?.id?.toString();
            if (userId) {
                try {
                    const res = await loginUser(userId);
                    if (res) {
                        setUserData(res.user);
                        if (uriParams?.tgWebAppStartParam) {
                            await referralUser(res.user.userId, {
                                referredById: uriParams?.tgWebAppStartParam?.split('#')?.[0],
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                }
            }
        };

        fetchUserData();
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
                updateClaimedWhisks,
                jettonBalance,
                isClaimable,
                airdropCell,
                campaignNumber,
                airdropList,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

