import { FC, ReactElement } from 'react';
import { Typography } from '../../shared/components/typography';
import styles from './footer.module.scss';
import { TonConnectModal } from '../ton-connect-modal/ton-connect-modal';

interface Props {
    points: number | undefined;
    claimedWhisks: number | undefined;
    isMobile: boolean;
}

export const Footer: FC<Props> = ({ points, claimedWhisks, isMobile }): ReactElement => {
    return (
        <div className={styles.app__footer_connect}>
            <div className={styles.app__footer_connect_container}>
                <div className={styles.app__footer_connect_score}>
                    <Typography fontSize={isMobile ? '16px' : '40px'}>Unclaimed whisk</Typography>
                    <Typography fontSize={isMobile ? '30px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                        {(points || 0) - (claimedWhisks || 0)}
                    </Typography>
                </div>
                <TonConnectModal />
            </div>
        </div>
    );
};

