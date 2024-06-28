import { FC, ReactElement } from 'react';
import styles from './invitation.module.scss';
import { UserData } from '../../app/providers/AppContext';
import { ActionButton } from '../../shared/components/action-button/ActionButton';
import { useNavigate } from 'react-router-dom';

interface Props {
    isMobile: boolean;
    userData: UserData | null;
}

export const REF_TEXT = `Earn $WHISK daily for free by spinning the wheel 🤑🚀! Use my invite link and spin twice to give me 3 bonus spins 🤍👇`;
export const WHISK_BOT_NAME = 'testWhiskers_bot/testwhisk';

export const Invitation: FC<Props> = ({ isMobile, userData }): ReactElement => {
    const navigate = useNavigate();

    const handleInvitation = () => {
        const refLink = `https://t.me/share/url?text=%0A${REF_TEXT}&url=https://t.me/${WHISK_BOT_NAME}?startapp=${userData?.userId}`;
        window.location.href = refLink;
    };

    const onNavigateToLevels = () => {
        navigate('/whiskers-frontend/levels');
    };

    const onNavigateToTasks = () => {
        navigate('/whiskers-frontend/tasks');
    };

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
                onClick={onNavigateToLevels}
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
                onClick={onNavigateToTasks}
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

