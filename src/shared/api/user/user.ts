import { Instance } from '../api-config';
import { BuySpinsBody, ReferralBody, SpinWheelBody } from './types';

export const userApi = {
    getSnapshot: () => Instance.get(`snapshot`),
    getAirdropList: () => Instance.get(`airdrop`),
    getUserInfoById: (id: string) => Instance.get(`user/${id}`),
    spinWheel: (userId: string, body: SpinWheelBody) => Instance.post(`spin/${userId}`, body),
    randomSector: (userId: string, isFreeSpin: boolean) => Instance.post(`random-sector/${userId}`, { isFreeSpin }),
    claimWhisks: (userId: string) => Instance.post(`claim-whisks/${userId}`),
    saveUserTonAddress: (userId: string, body: { userTonAddress: string }) =>
        Instance.post(`ton-address/${userId}`, body),
    verifyTelegramMembership: (userId: string) => Instance.post(`verify-telegram-membership/`, { userId }),
    buySpins: (userId: string, body: BuySpinsBody) => Instance.post(`buy/${userId}`, body),
    loginUser: (userId: string) => Instance.post(`login/${userId}`),
    userMe: (userId: string) => Instance.get(`me/${userId}`),
    referral: (refferedUserId: string, body: ReferralBody) => Instance.post(`referral/${refferedUserId}`, body),
    getTasks: (userId: string) => Instance.get(`tasks/${userId}`),
    fetchCurrentSector: (userId: string) => Instance.post(`set-current-sector/${userId}`),
    spinByUser: (userId: string, isFreeSpin: boolean) => Instance.post(`spin-by-user/${userId}`, { isFreeSpin }),
};

