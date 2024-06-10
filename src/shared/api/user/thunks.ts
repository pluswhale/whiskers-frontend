import { BuySpinsBody, ReferralBody, SpinWheelBody } from './types';
import { userApi } from './user';

export const loginUser = async (userId: string) => {
    try {
        const res = await userApi.loginUser(userId);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const fetchUserById = async (userId: string) => {
    try {
        const res = await userApi.getUserInfoById(userId);

        if (res) {
            return res;
        }

        return null;
    } catch (err) {
        console.error(err);
    }
};

export const spinWheelByUser = async (userId: string, body: SpinWheelBody) => {
    try {
        const res = await userApi.spinWheel(userId, body);
        return res;
    } catch (err) {
        console.error(err);
    }
};

export const buySpinsByUser = async (userId: string, body: BuySpinsBody) => {
    try {
        const res = await userApi.buySpins(userId, body);
        return res;
    } catch (err) {
        console.error(err);
    }
};

export const referralUser = async (referredUserId: string, body: ReferralBody) => {
    try {
        const res = await userApi.referral(referredUserId, body);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const saveUserTonAddress = async (userId: string, body: { userTonAddress: string }) => {
    try {
        const res = await userApi.saveUserTonAddress(userId, body);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const claimWhisks = async (userId: string) => {
    try {
        const res = await userApi.claimWhisks(userId);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const fetchSnapshotInfo = async () => {
    try {
        const res = await userApi.getSnapshot();
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export const fetchAirdropList = async () => {
    try {
        const res = await userApi.getAirdropList();
        return res.data[0].users;
    } catch (err) {
        console.error(err);
    }
}