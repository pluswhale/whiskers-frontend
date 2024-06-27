import { useNavigate } from 'react-router-dom';
import { Heading } from '../../shared/components/heading';
import { Logo } from '../../shared/components/logo';
import styles from './but-template.module.scss';
import { BUY_ROWS_DATA } from './constants';
import { BuyTokenRow } from '../../entities/buy-token-row/but-token-row';
import { Typography } from '../../shared/components/typography';
import { FC, ReactElement } from 'react';
import backIcon from '../../assets/images/back-arrow.png';
import { useAppContext } from '../../app/providers/AppContext';

export const BuyTemplate: FC = (): ReactElement => {
    const navigate = useNavigate();
    const { userData, jettonBalance } = useAppContext();

    const onNavigateToMainScreen = () => {
        navigate(-1);
    };

    return (
        <div className={styles.buy__wrapper}>
            <div className={styles.buy__container}>
                <div className={styles.buy__title_and_logo}>
                    <Logo fontSize={'42px'} />
                    <span className={styles.buy__title}>
                        <Heading className={styles.buy__heading} level="h1">
                            Spin&Earn
                        </Heading>
                    </span>
                </div>
                <Typography fontSize={'16px'} fontFamily="Montserrat, sans-serif">
                    Buy bonus spins with WHISK
                </Typography>
                <div className={styles.buy__buy_rows}>
                    {BUY_ROWS_DATA &&
                        BUY_ROWS_DATA.map((buyRow) => (
                            <BuyTokenRow
                                key={buyRow.id}
                                id={buyRow.id}
                                countSpin={buyRow.countSpins}
                                countWhisk={buyRow.countWhisks}
                                userId={userData?.userId}
                                userTonAddress={userData?.userTonAddress}
                            />
                        ))}
                </div>
                <div className={styles.buy__balance}>
                    <div onClick={onNavigateToMainScreen} className={styles.buy__back}>
                        <img src={backIcon} className={styles.buy__back_icon} alt="back to main screen" />
                        <Typography>Back</Typography>
                    </div>
                    <div className={styles.buy__balance_value}>
                        <Typography fontSize={'14px'} fontFamily="Montserrat, sans-serif">
                            Wallet balance
                        </Typography>
                        <Typography fontSize={'16px'} fontFamily="Montserrat, sans-serif">
                            {jettonBalance.toLocaleString()} WHISK
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};