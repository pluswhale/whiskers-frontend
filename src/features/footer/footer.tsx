import { FC, ReactElement, useState } from 'react';
import { Typography } from '../../shared/components/typography';
import styles from './footer.module.scss';
import { Button } from '../../shared/components/button';
import { useAppContext } from '../../app/providers/AppContext';
import { TonConnectModal } from '../ton-connect-modal/ton-connect-modal';
import { claimWhisks } from '../../shared/api/user/thunks';
import { Flip, toast } from 'react-toastify';
import { getTxByBOC, sleep } from '../../contracts/utils';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano, Cell, Dictionary } from '@ton/core';
import { Address, TonClient } from '@ton/ton';
import { Cell as TonCell, beginCell, Address as TonAddress, StateInit } from 'ton';
import axios from 'axios';
import { CONTRACT_ADDRESS, TRACE_API, NETWORK } from '../../contracts/config';
import { airdropEntryValue } from '../../contracts/Airdrop';
import { AirdropHelper } from '../../contracts/AirdropHelper';
import { airdropHelperHex } from './constants';

interface Props {
    points: number | undefined;
    claimedWhisks: number | undefined;
    isMobile: boolean;
}

export const Footer: FC<Props> = ({ points, claimedWhisks, isMobile }): ReactElement => {
    const { userData, isClaimable, airdropList, airdropCell, campaignNumber, updateClaimedWhisks } = useAppContext();
    const [isClaimButtonAccessible, setIsClaimedButtonAccessible] = useState<boolean>(true);
    const [tonConnectUI] = useTonConnectUI();
    const connected = tonConnectUI.connected;

    const userIndex = airdropList.findIndex(
        (x) =>
            Address.parse(x.userTonAddress).toString() ==
            Address.parse(userData?.userTonAddress || 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ').toString(),
    );
    let userUnclaimedAmount = 0;
    if (userIndex != -1) {
        userUnclaimedAmount = airdropList[userIndex].unclaimedWhisks;
    }

    async function waitForContractDeploy(address: Address, client: TonClient) {
        let isDeployed = false;
        let maxTries = 25;
        while (!isDeployed && maxTries > 0) {
            maxTries--;
            isDeployed = await client.isContractDeployed(address);
            if (isDeployed) return;
            await sleep(3000);
        }
        throw new Error('Timeout');
    }

    const onClaimWhisks = async () => {
        if (isClaimable != 1) {
            toast.error(`No snapshot yet. Claim after 7:00 GMT`, {
                position: 'bottom-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Flip,
            });
        } else if (!connected) {
            toast.error(`Connect your TON Wallet and try again`, {
                position: 'bottom-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Flip,
            });
        } else if (userData?.userId && userData?.userTonAddress && campaignNumber) {
            // check correct wallet address
            const userIdIndex = airdropList.findIndex((obj) => obj.userId.toString() == userData?.userId.toString());
            if (userIdIndex != -1) {
                const snapshotAddress = airdropList[userIdIndex].userTonAddress.toString();
                if (snapshotAddress != userData?.userTonAddress.toString()) {
                    toast.error(
                        `Please connect with previous wallet to claim or wait until next snapshot at 7:00 GMT`,
                        {
                            position: 'bottom-left',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'dark',
                            transition: Flip,
                        },
                    );
                    return;
                }
            }

            const endpoint = await getHttpEndpoint({ network: NETWORK });
            const client = new TonClient({ endpoint });

            const dictCell = Cell.fromBase64(airdropCell || '');
            const dict = dictCell.beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), airdropEntryValue);
            const index = airdropList.findIndex(
                (obj) =>
                    Address.parse(obj.userTonAddress).toString() ==
                    Address.parse(userData?.userTonAddress.toString()).toString(),
            );
            if (index == -1) {
                toast.error(`Not in the airdrop list. Please wait for the next snapshot!`, {
                    position: 'bottom-left',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    transition: Flip,
                });
                return;
            }
            const entryIndex = BigInt(index.toString());
            const proof = dict.generateMerkleProof(entryIndex);
            if (!client) {
                toast.error(`Cannot claim WHISK. Try again`, {
                    position: 'bottom-left',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    transition: Flip,
                });
            } else {
                const helper = client.open(
                    AirdropHelper.createFromConfig(
                        {
                            campaign_number: BigInt(campaignNumber),
                            airdrop: Address.parse(CONTRACT_ADDRESS),
                            index: entryIndex,
                            proofHash: proof.hash(),
                        },
                        Cell.fromBoc(Buffer.from(airdropHelperHex.hex, 'hex'))[0],
                    ),
                );
                const isClaimed = await helper.getClaimed();
                if (isClaimed) {
                    toast.error(`Already claimed! Please wait for the next snapshot`, {
                        position: 'bottom-left',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                    });
                    return;
                }
                if (!(await client.isContractDeployed(helper.address))) {
                    // await helper.sendDeploy(sender);
                    const stateInit = new StateInit({
                        code: TonCell.fromBoc(Buffer.from(airdropHelperHex.hex, 'hex'))[0],
                        data: beginCell()
                            .storeBit(false)
                            .storeAddress(TonAddress.parse(CONTRACT_ADDRESS))
                            .storeBuffer(proof.hash())
                            .storeUint(entryIndex, 256)
                            .storeUint(BigInt(campaignNumber), 16)
                            .endCell(),
                    });
                    const stateInitCell = new TonCell();
                    stateInit.writeTo(stateInitCell);
                    try {
                        const claimMsgRes = await tonConnectUI.sendTransaction({
                            messages: [
                                {
                                    address: helper.address.toString(),
                                    amount: toNano('0.1').toString(),
                                    stateInit: stateInitCell.toBoc().toString('base64'),
                                },
                            ],
                            validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
                        });
                        await waitForContractDeploy(helper.address, client!);
                        await sleep(1500);
                        await helper.sendClaim(123n, proof);

                        const exBoc = claimMsgRes.boc;
                        const txHash = await getTxByBOC(Address.parse(userData?.userTonAddress), exBoc);

                        // await sleep(15000); // wait for 15 more seconds
                        try {
                            const url = `${TRACE_API}${txHash}`;
                            const tonapiRes = await axios.get(url);
                            const txStatus = tonapiRes.data.children[0].transaction.success;
                            console.log('txStatus: ', txStatus);
                        } catch (err) {
                            console.log(err);
                        }

                        // if (txStatus) {
                        try {
                            const res = await claimWhisks(userData.userId);
                            if (res) {
                                updateClaimedWhisks();
                                if (res.message == 'successfully claimed whisks') {
                                    toast.success(`You claimed ${userUnclaimedAmount} $WHISK`, {
                                        position: 'bottom-left',
                                        autoClose: 3000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: 'dark',
                                        transition: Flip,
                                    });

                                    setIsClaimedButtonAccessible(false);

                                    setTimeout(() => {
                                        setIsClaimedButtonAccessible(true);
                                    }, 300_000); // 5 mins
                                }
                            }
                        } catch (err) {
                            toast.error(`Cannot claim WHISK. Try again`, {
                                position: 'bottom-left',
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: 'dark',
                                transition: Flip,
                            });
                        }
                        // }
                    } catch (err) {
                        toast.error(`User reject transaction`, {
                            position: 'bottom-left',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'dark',
                            transition: Flip,
                        });
                        return;
                    }
                }
                if (await client.isContractDeployed(helper.address)) {
                    if (!(await helper.getClaimed())) {
                        await helper.sendClaim(123n, proof);
                    }
                }
            }
        } else {
            toast.error(`Unknown error. Please try again later!`, {
                position: 'bottom-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Flip,
            });
        }
        // window.location.reload();
    };

    return (
        <div className={styles.app__footer_connect}>
            <div className={styles.app__footer_connect_container}>
                <div className={styles.app__footer_connect_score}>
                    <Typography fontSize={isMobile ? '18px' : '40px'}>Unclaimed WHISK</Typography>
                    <div className={styles.app__footer_connect_tokens}>
                        <Typography fontSize={isMobile ? '30px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                            {(points || 0) - (claimedWhisks || 0)}
                        </Typography>
                        <Button
                            disabled={!isClaimButtonAccessible}
                            onClick={onClaimWhisks}
                            fontFamily={'Montserrat, sans-serif'}
                            height={isMobile ? '24px' : '42px'}
                            fontSize={isMobile ? '16px' : '40px'}
                            backgroundImage={
                                isClaimButtonAccessible
                                    ? 'linear-gradient(rgb(32 167 228), rgb(0, 128, 187))'
                                    : 'linear-gradient(#C0C0C0, #808080)'
                            }
                            text={'Claim tokens'}
                            fontWeight={'normal'}
                            width={'fit-content'}
                            textTransform={'none'}
                            borderRadius="24px"
                        />
                    </div>
                </div>
                <div className={styles.app__footer_connect_wallet}>
                    <TonConnectModal />
                </div>
            </div>
        </div>
    );
};

