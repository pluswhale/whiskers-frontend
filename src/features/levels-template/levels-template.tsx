import { FC, ReactElement } from "react";
import { Typography } from "../../shared/components/typography";
import styles from './levels-template.module.scss';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useAppContext } from "../../app/providers/AppContext";
import { Logo } from "../../shared/components/logo";
import { Heading } from "../../shared/components/heading";
import { LEVEL_ROWS_DATA } from "./constants";
// import { Button } from "../../shared/components/button";
import { ActionButton } from "../../shared/components/action-button";
import backIcon from '../../assets/images/back-arrow.png';
import { REF_TEXT, WHISK_BOT_NAME } from "../invitation/invitation";
import { Icon } from "../../shared/components/icon";
// import { TonConnectModal } from '../ton-connect-modal/ton-connect-modal';

export const LevelsTemplate: FC = (): ReactElement => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const { userData } = useAppContext();
  // const [isClaimButtonAccessible, setIsClaimedButtonAccessible] = useState<boolean>(true);
  
  const onNavigateToMainScreen = () => {
    navigate(-1);
  };

  const onInvitation = () => {
    const refLink = `https://t.me/share/url?text=%0A${REF_TEXT}&url=https://t.me/${WHISK_BOT_NAME}?startapp=${userData?.userId}`;
    window.location.href = refLink;
  };

  return (
    <div className={styles.levels__wrapper}>
      <div className={styles.levels__container}>
        <div className={styles.levels__title_and_logo}>
          <Logo fontSize={'42px'} />
          <span className={styles.levels__title}>
            <Heading className={styles.levels__heading} level="h1">
              Spin&Earn
            </Heading>
          </span>
        </div>
        <div className={styles.levels__caption}>
          <Typography fontSize={'18px'} fontFamily="Montserrat, sans-serif">
            Current level
          </Typography>
          <Typography fontSize={'30px'} fontWeight={'bold'} fontFamily="Montserrat, sans-serif">
            1
          </Typography>
          <Typography fontSize={'16px'} align={'center'} fontFamily="Montserrat, sans-serif">
            You have a total of 5 referrals. 
            <br />
            Invite 25 more friends to reach level 2.
          </Typography>
        </div>
        <div className={styles.levels__levels_rows}>
          {LEVEL_ROWS_DATA &&
            LEVEL_ROWS_DATA.map(({ level, freeSpinLimit, referralsMin ,referralsMax }, index) => (
              <ActionButton
                key={index}
                onClick={onInvitation}
                imageLeft={<Icon style={{width: '25px', height: '25px', flexShrink: 0}} src={`/whiskers-frontend/src/assets/images/circle-${index+1}.png`} />}
                textRight={referralsMax ? `${referralsMin}-${referralsMax}`: `${referralsMin}+`}
                subTextRight={'referrals'}
                fontFamily={'Montserrat, sans-serif'}
                height={isMobile ? '65px' : '200px'}
                textTransform={'none'}
                text={`Level ${level}`}
                subText={`${freeSpinLimit} free spins limit`}
                fontWeight={'bolder'}
                borderRadius={'12px'}
                gap={'10px'}
                stylesForTexts={{
                  main: { fontSize: isMobile ? '18px' : '42px', fontWeight: 'bold', textAlign: 'left' },
                  sub: { fontSize: isMobile ? '14px' : '32px', fontWeight: 'normal', textAlign: 'left' },
                }}
                stylesForTextsRight={{
                  main: { fontSize: isMobile ? '24px' : '42px', fontWeight: 'bold' },
                  sub: { fontSize: isMobile ? '14px' : '32px', fontWeight: 'normal' },
                }}
              />
            ))}
        </div>
        <div className={styles.levels__balance}>
          <div onClick={onNavigateToMainScreen} className={styles.levels__back}>
            <img src={backIcon} className={styles.levels__back_icon} alt="back to main screen" />
            <Typography>Back</Typography>
          </div>
        </div>
        {/* <div className={styles.buy__footer_connect}>
          <div className={styles.buy__footer_connect_container}>
            <div className={styles.buy__footer_connect_score}>
              <Typography fontSize={isMobile ? '18px' : '40px'}>Unclaimed WHISK</Typography>
              <div className={styles.buy__footer_connect_tokens}>
                <Typography
                  fontSize={isMobile ? '30px' : '50px'}
                  fontFamily="Roundy Rainbows, sans-serif"
                >
                  {(userData?.points || 0) - (userData?.claimedWhisks || 0)}
                </Typography>
                <Button
                  onClick={onInvitation}
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
            <div className={styles.buy__footer_connect_wallet}>
              <TonConnectModal />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}