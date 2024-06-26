import { FC, ReactElement } from 'react';
// import { Button } from '../../shared/components/button';
// import giftIcon from '../../assets/images/gift_icon.png';

import styles from './invitation.module.scss';
// import { Flip, toast } from 'react-toastify';
import { UserData } from '../../app/providers/AppContext';
import { ActionButton } from '../../shared/components/action-button/ActionButton';

interface Props {
    isMobile: boolean;
    userData: UserData | null;
}

export const REF_TEXT = `Earn $WHISK daily for free by spinning the wheel 🤑🚀! Use my invite link and spin twice to give me 3 bonus spins 🤍👇`;
export const WHISK_BOT_NAME = 'spinearnbot/spinandearn';

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

    const handleInvitation = () => {
        const refLink = `https://t.me/share/url?text=%0A${REF_TEXT}&url=https://t.me/${WHISK_BOT_NAME}?startapp=${userData?.userId}`;
        window.location.href = refLink;
    };

    const handleLevels = () => {
        window.location.href = '/whiskers-frontend/levels'
    }

    return (
        <div className={styles.app__invitation}>
            <ActionButton
                onClick={handleInvitation}
                fontFamily={'Montserrat, sans-serif'}
                height={isMobile ? '65px' : '200px'}
                textTransform={'none'}
                text={'Invite'}
                subText={'Get 3 spins'}
                fontWeight={'bolder'}
                borderRadius={'12px'}
                stylesForTexts={{
                    main: { fontSize: isMobile ? '18px' : '42px', fontWeight: 'bold' },
                    sub: { fontSize: isMobile ? '16px' : '32px', fontWeight: 'normal' },
                }}
             />
             <ActionButton
                onClick={handleLevels}
                fontFamily={'Montserrat, sans-serif'}
                height={isMobile ? '65px' : '200px'}
                textTransform={'none'}
                text={'Level'}
                subText={'1'}
                fontWeight={'bolder'}
                borderRadius={'12px'}
                stylesForTexts={{
                    main: { fontSize: isMobile ? '18px' : '42px', fontWeight: 'bold' },
                    sub: { fontSize: isMobile ? '16px' : '32px', fontWeight: 'normal' },
                }}
             />
             <ActionButton
                onClick={handleInvitation}
                fontFamily={'Montserrat, sans-serif'}
                height={isMobile ? '65px' : '200px'}
                textTransform={'none'}
                text={'Tasks'}
                subText={'Earn WHISK'}
                fontWeight={'bolder'}
                borderRadius={'12px'}
                stylesForTexts={{
                    main: { fontSize: isMobile ? '18px' : '42px', fontWeight: 'bold' },
                    sub: { fontSize: isMobile ? '16px' : '32px', fontWeight: 'normal' },
                }}
             />
        </div>
    );
};

