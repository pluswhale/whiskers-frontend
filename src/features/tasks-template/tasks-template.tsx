import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../app/providers/AppContext';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import styles from './tasks-template.module.scss';
import { Logo } from '../../shared/components/logo';
import { Heading } from '../../shared/components/heading';
import { Typography } from '../../shared/components/typography';
import { ActionButton } from '../../shared/components/action-button';
import { Icon } from '../../shared/components/icon';
import backIcon from '../../assets/images/back-arrow.png';
import { REF_TEXT, WHISK_BOT_NAME } from '../invitation/invitation';
import inviteIcon from '../../assets/images/invite.png';
import megaphoneIcon from '../../assets/images/megaphone.png';
import telegramIcon from '../../assets/images/telegram.png';
import { fetchTasks } from '../../shared/api/user/thunks';

export const TasksTemplate: FC = (): ReactElement => {
    const navigate = useNavigate();
    const { userData, isMobile, addPointForJoiningGroup } = useAppContext();
    const [tasks, setTasks] = useState<any[]>([]);
    const memoizedTasks = useMemo(() => tasks?.filter((task) => !task.isCompleted), [tasks])
    const onNavigateToMainScreen = () => {
        navigate(-1);
    };

    const onInvitation = () => {
        const refLink = `https://t.me/share/url?text=%0A${REF_TEXT}&url=https://t.me/${WHISK_BOT_NAME}?startapp=${userData?.userId}`;
        window.location.href = refLink;
    };

    const onJoinTg = () => {
        window.location.href = 'https://t.me/whiskersTON'; //insert a link to the bot when it's ready

        const intervalId = setInterval(() => {
            if (userData) {
                addPointForJoiningGroup(userData.tasks, userData.userId, clearInterval(intervalId));
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
        }, 120000); // 120000 ms = 2 minutes
    };

    useEffect(() => {
        const fetchUserTasks = async () => {
            const tasks = await fetchTasks(userData?.userId || '');
            setTasks(tasks);
        }

        fetchUserTasks();
    }, [])

    return (
        <div className={styles.tasks__wrapper}>
            <div className={styles.tasks__container}>
                <div className={styles.tasks__title_and_logo}>
                    <Logo fontSize={'42px'} />
                    <span className={styles.tasks__title}>
                        <Heading className={styles.tasks__heading} level="h1">
                            Spin&Earn
                        </Heading>
                    </span>
                </div>
                <div className={styles.tasks__caption}>
                    <Typography fontSize={'18px'} fontFamily="Montserrat, sans-serif">
                        Complete tasks to earn more WHISK
                    </Typography>
                </div>
                <div className={styles.tasks__tasks_rows}>
                    {memoizedTasks.length > 0 ?
                        memoizedTasks
                            .map(({ name, description, reward }, index, users) => (
                                <ActionButton
                                    key={index}
                                    onClick={index === users.length - 1 ? onJoinTg : onInvitation}
                                    imageLeft={
                                        index === users.length - 1 ? (
                                            <Icon
                                                style={{ width: '20px', height: '20px', flexShrink: 0 }}
                                                src={telegramIcon}
                                            />
                                        ) : (
                                            <Icon
                                                style={{ width: '20px', height: '20px', flexShrink: 0 }}
                                                src={inviteIcon}
                                            />
                                        )
                                    }
                                    textRight={String(reward)}
                                    subTextRight={'WHISK'}
                                    fontFamily={'Montserrat, sans-serif'}
                                    height={isMobile ? '65px' : '200px'}
                                    textTransform={'none'}
                                    text={name}
                                    subText={description}
                                    fontWeight={'bolder'}
                                    borderRadius={'12px'}
                                    gap={'20px'}
                                    stylesForTexts={{
                                        main: {
                                            fontSize: isMobile ? '18px' : '42px',
                                            fontWeight: 'bold',
                                            textAlign: 'left',
                                        },
                                        sub: {
                                            fontSize: isMobile ? '14px' : '32px',
                                            fontWeight: 'normal',
                                            textAlign: 'left',
                                            whiteSpace: 'wrap',
                                        },
                                    }}
                                    stylesForTextsRight={{
                                        main: {
                                            fontSize: isMobile ? '24px' : '42px',
                                            fontWeight: 'bold',
                                            fontFamily: 'Roundy Rainbows, sans-serif',
                                        },
                                        sub: { fontSize: isMobile ? '14px' : '32px', fontWeight: 'normal' },
                                    }}
                                    backgroundImage={'linear-gradient(to bottom, #383a51 20%, #252739)'}
                                />
                            )) : <Typography align='center'>You have completed all tasks! Stay tuned for updates</Typography>}
                </div>
                <div className={styles.tasks__balance}>
                    <div onClick={onNavigateToMainScreen} className={styles.tasks__back}>
                        <img src={backIcon} className={styles.tasks__back_icon} alt="back to main screen" />
                        <Typography>Back</Typography>
                    </div>
                </div>
                <Link className={styles.tasks__share} to="https://t.me/robnguyen9">
                    {' '}
                    {/*swap to telegram channel link*/}
                    <div>
                        <img src={megaphoneIcon} />
                    </div>
                    <p>Advertise your group or channel</p>
                </Link>
            </div>
        </div>
    );
};

