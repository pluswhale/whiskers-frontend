import { Instance } from '../api-config';
import { BuySpinsBody, ReferralBody, SpinWheelBody } from './types';

export const userApi = {
    getSnapshot: () => Instance.get(`snapshot`),
    getAirdropList: () => Instance.get(`airdrop`),
    getUserInfoById: (id: string) => Instance.get(`user/${id}`),
    spinWheel: (userId: string, body: SpinWheelBody) => Instance.post(`spin/${userId}`, body),
    claimWhisks: (userId: string) => Instance.post(`claim-whisks/${userId}`),
    saveUserTonAddress: (userId: string, body: { userTonAddress: string }) =>
        Instance.post(`ton-address/${userId}`, body),
    buySpins: (userId: string, body: BuySpinsBody) => Instance.post(`buy/${userId}`, body),
    loginUser: (userId: string) => Instance.post(`login/${userId}`),
    referral: (refferedUserId: string, body: ReferralBody) => Instance.post(`referral/${refferedUserId}`, body),
};

