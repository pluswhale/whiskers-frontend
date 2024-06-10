import { FC, ReactElement } from 'react';
import styles from './but-token-row.module.scss';
import { Typography } from '../../shared/components/typography';
import { Button } from '../../shared/components/button';
import { useMediaQuery } from 'react-responsive';
import { Flip, toast } from 'react-toastify';
import { buySpinsByUser } from '../../shared/api/user/thunks';
import { useAppContext } from '../../app/providers/AppContext';
import { toNano, Address, beginCell, TonClient } from '@ton/ton';
import { JETTON_MINTER_ADDRESS, TREASURY_ADDRESS, TRACE_API, NETWORK } from '../../contracts/config';
import { JettonWallet } from '../../contracts/JettonWallet';
import { JettonMinter } from '../../contracts/JettonMinter';
import { getTxByBOC, sleep } from '../../contracts/utils';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { useTonConnectUI } from '@tonconnect/ui-react';
import axios from 'axios';

type BuyRow = {
    id: number;
    countSpin: number;
    countWhisk: number;
    userId: string | undefined;
    userTonAddress: string | undefined;
};

export const BuyTokenRow: FC<BuyRow> = (row): ReactElement => {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const { updateBonusSpins } = useAppContext();
    const [tonConnectUI] = useTonConnectUI();
    const connected = tonConnectUI.connected;

    const { id, countSpin, countWhisk, userId, userTonAddress } = row;

    const onBuyBonusToken = async (countSpin: number) => {
        if (!userTonAddress) {
            toast.error(`Please connect TON wallet!`, {
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
            toast.error(`Please connect TON Wallet!`, {
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
        else if (userId && userTonAddress) {
            // send jetton transfer message
            const jettonAmount = toNano(countWhisk);
            const to = Address.parse(TREASURY_ADDRESS);
            const responseAddress = Address.parse(userTonAddress);
            const customPayload = beginCell().endCell();
            const forwardTonAmount = toNano('0.01');
            const forwardPayload = beginCell().endCell();
            const payload = JettonWallet.transferMessage(jettonAmount, to, responseAddress, customPayload, forwardTonAmount, forwardPayload);

            const endpoint = await getHttpEndpoint({ network: NETWORK });
            const client = new TonClient({ endpoint });
            const minter = new JettonMinter(Address.parse(JETTON_MINTER_ADDRESS));
            const minterContract = client.open(minter);

            const jettonWalletAddress = await minterContract.getWalletAddressOf(Address.parse(userTonAddress));
            const value = toNano('0.05');

            try {
                const sendMsgRes = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: jettonWalletAddress.toString(),
                            amount: value.toString(),
                            payload: payload?.toBoc().toString('base64'),
                        },],
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve 
                });
                const exBoc = sendMsgRes.boc;
                const txHash = await getTxByBOC(Address.parse(userTonAddress), exBoc);

                await sleep(15000); // wait for 15 more seconds
                const url = `${TRACE_API}${txHash}`;
                const tonapiRes = await axios.get(url);
                const txStatus = tonapiRes.data.children[0].transaction.success;
                if (!txStatus) {
                    toast.error(`Can't buy spins.`, {
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
                    // update spins in database
                    const res = await buySpinsByUser(userId, { countSpins: countSpin });

                    if (res?.status === 200) {
                        updateBonusSpins(countSpin);

                        toast.success(`You bought ${countSpin} spins`, {
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
                        toast.error(`Can't buy spins.`, {
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
                }
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
            }
        }
    };
    return (
        <div key={id} className={styles.buy_row__wrapper}>
            <div className={styles.buy_row__container}>
                <div className={styles.buy_row__spins}>
                    <Typography fontSize={isMobile ? '26px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                        {countSpin}
                    </Typography>
                    <Typography fontSize={isMobile ? '16px' : '24px'} fontFamily="Montserrat, sans-serif">
                        spins
                    </Typography>
                </div>
                <div className={styles.buy_row__whisks}>
                    <Typography fontSize={isMobile ? '16px' : '28px'} fontFamily="Montserrat, sans-serif">
                        {BigInt(countWhisk).toLocaleString()}
                    </Typography>
                    <Typography fontSize={isMobile ? '16px' : '26px'} fontFamily="Montserrat, sans-serif">
                        WHISK
                    </Typography>
                </div>
                <Button
                    onClick={() => onBuyBonusToken(countSpin)}
                    fontFamily={'Montserrat, sans-serif'}
                    height={isMobile ? '28px' : '52px'}
                    fontSize={isMobile ? '14px' : '28px'}
                    boxShadow={
                        '0px 2px 2px rgba(0, 0, 0, 0.1), inset 0px 1px 1px rgb(255 161 161 / 60%), inset 0px -3px 2px rgba(0, 0, 0, 0.2)'
                    }
                    text={'Buy now'}
                    fontWeight={'normal'}
                    width={'fit-content'}
                    textTransform={'none'}
                    borderRadius="24px"
                />
            </div>
        </div>
    );
};

