import { FC, ReactElement } from 'react';
import { Button } from '../../shared/components/button';
import giftIcon from '../../assets/images/gift_icon.png';

import styles from './invitation.module.scss';
// import { Flip, toast } from 'react-toastify';
import { UserData } from '../../app/providers/AppContext';

interface Props {
    isMobile: boolean;
    userData: UserData | null;
}

const REF_TEXT = 'Spin and Earn WHISK';
const WHISK_BOT_NAME = 'wheelwhiskbot/spinandearn';

export const Invitation: FC<Props> = ({ isMobile, userData }): ReactElement => {
    /*
    const copyToClipboard = async () => {
        if (!userData?.userId) {
            toast.error(`Cannot get a referal link :(`, {
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
            try {
                await navigator.clipboard.writeText(
                    `https://t.me/${WHISK_BOT_NAME}?startapp=${userData?.userId}`,
                );

                toast.success(`You copied ref link to clipboard`, {
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
            } catch (err) {
                toast.error(`Cannot get a referal link :(`, {
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
    */

    const handleClick = () => {
        const refLink = `https://t.me/share/url?text=${REF_TEXT}&url=https://t.me/${WHISK_BOT_NAME}?startapp=${userData?.userId}`;
        window.location.href = refLink;
    }

    return (
        <div className={styles.app__invitation}>
            <Button
                // onClick={copyToClipboard}
                onClick={handleClick}
                imageLeft={giftIcon}
                fontFamily={'Montserrat, sans-serif'}
                height={isMobile ? '65px' : '200px'}
                textTransform={'none'}
                text={'Refer A Friend'}
                subText={'Get 3 bonus spins'}
                fontWeight={'bolder'}
                borderRadius={'12px'}
                stylesForTexts={{
                    main: { fontSize: isMobile ? '24px' : '42px', fontWeight: 'bold' },
                    sub: { fontSize: isMobile ? '18px' : '32px', fontWeight: 'normal' },
                }}
            />
        </div>
    );
};

