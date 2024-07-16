/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, ReactElement, useContext, useEffect, useRef, useState } from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import {
    loginUser,
    referralUser,
    fetchSnapshotInfo,
    fetchAirdropList,
    verifyTelegramMembershipByUser,
    fetchCurrentSector,
    spinByUser,
    fetchUserMe,
} from '../../shared/api/user/thunks';
import { useMediaQuery } from 'react-responsive';
import { removeAllCookies } from '../../shared/libs/cookies';
import { parseUriParamsLine } from '../../shared/utils/parseUriParams';
import DeviceCheckingScreen from '../../features/device-checking-screen/DeviceCheckingScreen';
import MobileDetect from 'mobile-detect';

import { TonClient, Address, JettonMaster, fromNano } from '@ton/ton';
import { JettonWallet } from '../../contracts/JettonWallet';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { NETWORK, JETTON_MINTER_ADDRESS } from '../../contracts/config';

//@ts-ignore
const testUserId = '574813379';

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
    level: number;
    claimedWhisks: number;
    tasks: UserTask[];
    userTonAddress: string;
    updatedAt: string;
    lastSpinTime: string[];
    userId: string;
    currentSector: {
        prizeValue: any;
        sector: number;
    };
    __v: number;
    _id: string;
}

export type UserTask = {
    taskId: string;
    name: string;
    description?: string;
    reward: number;
    isCompleted: boolean;
    _id: string;
};

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
    setUserData: any;
    isFreeSpins: boolean | null;
    isMobile: boolean;
    isAvailableToSpin: boolean;
    tgUser: TelegramUserData | null;
    updateFreeSpins: () => void;
    updateBonusSpins: (countSpins?: number) => void;
    updateTempWinScore: (score: number, delay: number) => void;
    updateClaimedWhisks: () => void;
    updateTonAddress: (address: string) => void;
    addPointForJoiningGroup: (userTasks: UserTask[], userId: string, clearInterval?: any) => void;
    setIsWheelSpinning: (arg: boolean) => void;
    jettonBalance: number;
    isClaimable: number | null;
    airdropCell: string | null;
    campaignNumber: number | null;
    airdropList: any[];
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
    const [isWheelSpinning, setIsWheelSpinning] = useState<boolean>(false);
    const [tgUser, setTgUser] = useState<TelegramUserData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
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
    const intervalRef = useRef<any>(null);

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
            const user = tg.initDataUnsafe.user;
            if (!user) {
                setUserId(testUserId);
            } else {
                setUserId(user.id);
                setTgUser(user);
            }
        } else {
            console.error('Telegram WebApp is not initialized or running outside of Telegram context.');
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;

            try {
                const { user } = await loginUser(userId);
                if (user) {
                    if (user.currentSector.prizeValue === 0) {
                        user.currentSector = (await fetchCurrentSector(userId))?.data;
                    }
                    setUserData(user);

                    await addPointForJoiningGroup(user.tasks, userId); // -- add 500 points if user join to group

                    if (uriParams?.tgWebAppStartParam) {
                        await referralUser(user.userId, {
                            referredById: uriParams.tgWebAppStartParam?.split('#')?.[0],
                        });
                    }
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        };

        fetchUserData();
    }, [userId, uriParams?.startapp]);

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
                    setIsClaimable(res?.[0]?.isClaimable);
                    setAirdropCell(res?.[0]?.airdropCell);
                    setCampaignNumber(res?.[0]?.campaignNumber);
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
        const cleanup = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        async function pollFreeSpin() {
            if (userData && userData?.lastSpinTime?.length > 0 && !isWheelSpinning) {
                const checkSpinTimes = async () => {
                    const now = new Date();

                    for (const spinTime of userData.lastSpinTime) {
                        if (new Date(spinTime) <= now) {
                            if (userId) await fetchUserMe(userId, setUserData);
                        }
                    }
                };

                // Clear the existing interval if there is one
                cleanup();

                // Set a new interval and store its ID in the ref
                intervalRef.current = setInterval(checkSpinTimes, 3_000);
            } else if (userId && userData?.lastSpinTime?.length === 0) {
                const newSector = await fetchCurrentSector(userId);

                if (newSector?.data) {
                    //@ts-ignore
                    setUserData((prevUserData) => ({
                        ...prevUserData,
                        currentSector: newSector?.data,
                    }));
                }
            }
        }

        pollFreeSpin();

        return cleanup;
    }, [userId, userData?.lastSpinTime, isWheelSpinning, fetchUserMe, setUserData, fetchCurrentSector]);

    if (!isMobileDevice || isTelegramWebApp) {
        return <DeviceCheckingScreen />;
    }

    if (loading && !isAppLoaded) {
        return <LoaderScreen />;
    }

    const updateTempWinScore = async (score: number, delay: number) => {
        if (userId) {
            if (isFreeSpins) {
                setUserData((prevUserData: any) => ({
                    ...prevUserData,
                    spinsAvailable: prevUserData.spinsAvailable - 1,
                }));
            } else {
                setUserData((prevUserData: any) => ({
                    ...prevUserData,
                    bonusSpins: prevUserData.bonusSpins - 1,
                }));
            }

            try {
                await spinByUser(userId, Boolean(isFreeSpins));

                const newSector = await fetchCurrentSector(userId);

                if (newSector?.data) {
                    setUserData((prevUserData: any) => ({
                        ...prevUserData,
                        currentSector: newSector?.data,
                    }));
                }

                await fetchUserMe(userId, setUserData);
            } catch (error) {
                console.error('Spin request failed', error);
                setUserData((prevUserData: any) => ({
                    ...prevUserData,
                    points: prevUserData.points - score,
                }));

                if (isFreeSpins) {
                    setUserData((prevUserData: any) => ({
                        ...prevUserData,
                        spinsAvailable: prevUserData.spinsAvailable + 1,
                    }));
                } else {
                    setUserData((prevUserData: any) => ({
                        ...prevUserData,
                        bonusSpins: prevUserData.bonusSpins + 1,
                    }));
                }
            }
        }

        setTimeout(() => {
            setUserData((prevUserData: any) => ({
                ...prevUserData,
                points: prevUserData.points + score,
            }));
        }, delay); // because a little delay in animation
    };
    const updateTonAddress = async (address: string) => {
        setUserData((prevUserData: any) => ({
            ...prevUserData,
            userTonAddress: address,
        }));
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

    async function addPointForJoiningGroup(userTasks: UserTask[], userId: string, clearInterval?: any) {
        const isUserJoinedToTelegramGroup = userTasks?.[2]?.isCompleted;

        if (!isUserJoinedToTelegramGroup) {
            const res = await verifyTelegramMembershipByUser(userId);

            if (res && res.status === 200) {
                const updatedTasks = userTasks?.map((task) => {
                    if (task.name === 'Join Telegram group') {
                        return { ...task, isCompleted: true };
                    } else {
                        return task;
                    }
                });

                setUserData((prev: any) => ({ ...prev, points: prev?.points + 500, tasks: updatedTasks }));

                if (clearInterval) clearInterval();
            }
        }
    }

    function onExitFromApp() {
        removeAllCookies();
        tg.close();
    }

    return (
        <AppContext.Provider
            value={{
                tgUser,
                userData,
                setUserData,
                isFreeSpins,
                isAvailableToSpin,
                isMobile,
                updateTempWinScore,
                updateFreeSpins,
                updateBonusSpins,
                updateClaimedWhisks,
                updateTonAddress,
                addPointForJoiningGroup,
                setIsWheelSpinning,
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

