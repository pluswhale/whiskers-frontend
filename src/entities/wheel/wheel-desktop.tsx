import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import kitty from '../../assets/images/kitty.png';
import { useAppContext } from '../../app/providers/AppContext';
import { useMediaQuery } from 'react-responsive';
import loaderIcon from '../../assets/images/loader.png';
import soundWheel from '../../assets/sounds/Fortune-Prize-Wheel-01.mp3';
import styles from './wheel.module.scss';
import { Typography } from '../../shared/components/typography';
import React from 'react';
import { LottieAnimation } from '../lottie-animation/lottie-animation';
import coinAnimation from '../../assets/animations/coin-dollar.json';
import { Flip, toast } from 'react-toastify';
import { sectorsData } from './constants';
import { WHEEL_SPINNING_SECONDS } from '../../shared/libs/constants';

interface WheelDesktopProps {
    isAvailableToSpin: boolean;
    isUserLoggedIn: boolean;
}

export const WheelDesktop: FC<WheelDesktopProps> = ({ isAvailableToSpin, isUserLoggedIn }): ReactElement => {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const { isFreeSpins, updateFreeSpins, updateBonusSpins, updateTempWinScore } = useAppContext();
    const [isNeedRotateSpinIcon, setIsNeedRotateSpinIcon] = useState<boolean>(false);
    const [isDisplayAnimation, setIsDisplayAnimation] = useState<boolean>(false);
    const audioRef = React.createRef<any>();
    const [imageLoaded, setImageLoaded] = useState(false);
    const image = useRef(new Image());
    const canvasRef = useRef<any>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | any>(null);

    //constants
    const increaseCoeff = 4; //for canvas better quality

    const pictureParams = {
        image: image,
        x: 395 * increaseCoeff,
        y: 375 * increaseCoeff,
        w: 210 * increaseCoeff,
        h: 230 * increaseCoeff,
    };

    const width = 1000; //canvas observable width
    const height = 1000;
    const dpiWidth = width * increaseCoeff; //canvas real width
    const dpiHeight = height * increaseCoeff;
    const centerX = Math.floor(dpiWidth / 2); //center point of wheel
    const centerY = Math.floor(dpiHeight / 2);
    const radius1 = 454 * increaseCoeff; //biggest radius
    const radiusMicroPointCircle = 424 * increaseCoeff;
    const radius2 = 395 * increaseCoeff;
    const radius3 = 368 * increaseCoeff;
    const radiusText = 262 * increaseCoeff;
    const radius4 = 128 * increaseCoeff;
    const radius5 = 108 * increaseCoeff;
    const radius6 = 102 * increaseCoeff; //smallest radius
    const radiusMicroPoint = 12 * increaseCoeff;
    const circleColour1 = '#1d3649';
    const circleColour2 = 'rgba(0,0,0,0.15)';
    const circleColour4 = '#1d3749';
    const circleColour5 = '#f4f4f4';
    const circleColour6 = '#0594d3';
    const circleColourMicro = '#f4f4f4';
    const textFontSize = 72;
    const dpiTextFontSize = textFontSize * increaseCoeff;
    const textStyles = {
        fillColor: '#fff',
        textFont: `${dpiTextFontSize}px Roundy Rainbows, sans-serif`,
    };

    const turns = 4; //number of turns for one spin
    const oneSectorAngle = 1 / sectorsData.length;
    const beginTwistAngleRef = useRef(-0.25);
    const winAngleRef = useRef(0);
    const spinCountRef = useRef(0);

    useEffect(() => {
        image.current.onload = () => {
            setImageLoaded(true);
        };
        image.current.src = kitty;

        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                setCtx(context);
            }
        }

        return () => {
            cleanUpFunc();
        };
    }, []);

    useEffect(() => {
        if (canvasRef.current && imageLoaded && ctx) {
            InitializeWheel();
        }
    }, [imageLoaded, ctx]);

    function cleanUpFunc() {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsDisplayAnimation(false);
        setIsNeedRotateSpinIcon(false);
    }

    function InitializeWheel() {
        drawWheel(beginTwistAngleRef.current, sectorsData);
    }

    const handleSpinButtonClick = () => {
        if (isUserLoggedIn) {
            if (isNeedRotateSpinIcon || !isAvailableToSpin) return; //

            if (isDisplayAnimation) setIsDisplayAnimation(false);

            if (!isFreeSpins) {
                updateBonusSpins();
            } else {
                updateFreeSpins();
            }

            twistWheel();

            setIsNeedRotateSpinIcon(true);
            audioRef.current.play();

            setTimeout(() => {
                setIsDisplayAnimation(true);
            }, WHEEL_SPINNING_SECONDS);

            // setTimeout(() => {
            //     if (audioRef.current) {
            //         audioRef.current.pause();
            //     }
            // }, 7_000);

            setTimeout(() => {
                setIsNeedRotateSpinIcon(false);
            }, 9_000);

            setTimeout(() => {
                setIsDisplayAnimation(false);
            }, 12_000);
        } else {
            toast.error(`Cannot spin it`, {
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
    };

    function twistWheel() {
        const randomSectorValue = randomSector();
        //@ts-ignore
        const randomSectorCenter = -(oneSectorAngle * (randomSectorValue + 0.5)).toFixed(4);

        if (spinCountRef.current) beginTwistAngleRef.current = winAngleRef.current;

        spinCountRef.current++;

        winAngleRef.current = randomSectorCenter;

        if (winAngleRef.current >= 1) winAngleRef.current--;
        if (winAngleRef.current < 0) winAngleRef.current++;

        animate({
            duration: 5000,
            timing: timing,
        });
    }

    //get random sector according to sectors probabilities
    function randomSector() {
        const randomNumber = Math.floor(Math.random() * 360) + 1; // 1...360

        for (let i = 0, upperBorder = 0; i < sectorsData?.length; i++) {
            //@ts-ignore
            upperBorder += sectorsData?.[i]?.probability;
            if (randomNumber < upperBorder) {
                updateTempWinScore(sectorsData?.[i]?.value); // add score setter and make request here
                return i;
            }
        }
    }

    //@ts-ignore
    function animate({ timing, duration }) {
        const start = performance.now();
        const raf = requestAnimationFrame(function animate(time) {
            // timeFraction from 0 to 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            const progress =
                beginTwistAngleRef.current +
                timing(timeFraction) * (-beginTwistAngleRef.current + winAngleRef.current + turns);
            redrawWheel(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(raf);
            }
        });
    }

    //@ts-ignore
    function timing(timeFraction) {
        if (timeFraction < 0.25) {
            return timeFraction * 2;
        } else {
            return Math.pow(timeFraction, 1 / 2);
        }
    }

    //@ts-ignore
    function redrawWheel(beginTwistAngle) {
        ctx.clearRect(0, 0, dpiWidth, dpiHeight);
        drawWheel(beginTwistAngle, sectorsData);
    }

    //@ts-ignore
    function drawWheel(beginAngle, sectorsData) {
        drawOuterWheelPart();
        drawMiddleWheelPart(beginAngle, sectorsData);
        drawInnerWheelPart();

        const { image, x, y, w, h } = pictureParams;
        //@ts-ignore
        ctx.drawImage(image.current, x, y, w, h);

        drawTriangle();
    }

    function drawOuterWheelPart() {
        drawCircleBorder(centerX, centerY, radius1, radius2, circleColour1);
        drawPointsOnCircle(
            centerX,
            centerY,
            radiusMicroPointCircle,
            radiusMicroPoint,
            oneSectorAngle,
            circleColourMicro,
        );
    }

    //@ts-ignore
    function drawMiddleWheelPart(beginAngle, sectorsData) {
        let currentAngle = beginAngle;
        //@ts-ignore
        sectorsData?.map((sector) => {
            drawWholeSector(
                radius2,
                radiusText,
                currentAngle,
                currentAngle + oneSectorAngle,
                sector.colour,
                sector.value,
            );

            currentAngle += oneSectorAngle;
        });

        drawCircleBorder(centerX, centerY, radius2, radius3, circleColour2);
    }

    function drawInnerWheelPart() {
        drawCircleBorder(centerX, centerY, radius5, radius4, circleColour4);
        drawCircleBorder(centerX, centerY, radius6, radius5, circleColour5);
        drawCircle(centerX, centerY, radius6, circleColour6);
    }

    //@ts-ignore
    function drawCircleBorder(centerX, centerY, radiusExternal, radiusInternal, colour) {
        ctx.save();

        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusExternal, 0, 2 * Math.PI, false);
        ctx.arc(centerX, centerY, radiusInternal, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    //@ts-ignore
    function drawCircle(centerX, centerY, radius, colour) {
        ctx.save();

        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    //@ts-ignore
    function drawPointsOnCircle(circleCenterX, circleCenterY, circleRadius, pointRadius, angle, colour) {
        let centerX, centerY;
        let currentAngle = 0;

        while (currentAngle < 1) {
            centerX = circleCenterX + circleRadius * Math.cos(currentAngle * 2 * Math.PI);
            centerY = circleCenterY + circleRadius * Math.sin(currentAngle * 2 * Math.PI);

            if (currentAngle < 0.625 || currentAngle > 0.875) {
                drawCircle(centerX, centerY, pointRadius, colour);
            }

            currentAngle += angle;
        }
    }

    function drawTriangle() {
        const side = 110 * increaseCoeff;
        ctx.save();

        ctx.strokeStyle = '#f4f4f4';
        ctx.fillStyle = '#f4f4f4';
        ctx.lineWidth = 10 * increaseCoeff;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(centerX + 400 * increaseCoeff, centerY);
        ctx.lineTo(centerX + 400 * increaseCoeff + (side * Math.sqrt(3)) / 2, centerY + side / 2);
        ctx.lineTo(centerX + 400 * increaseCoeff + (side * Math.sqrt(3)) / 2, centerY - side / 2);

        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.restore();
    }

    //@ts-ignore
    function drawWholeSector(radius, radiusText, startAnglePart, endAnglePart, sectorFillColor, text) {
        const startAngle = startAnglePart * 2 * Math.PI;
        const endAngle = endAnglePart * 2 * Math.PI;
        const midAngle = ((startAnglePart + endAnglePart) / 2) * 2 * Math.PI;

        drawSector(radius, startAngle, endAngle, sectorFillColor);
        drawSectorText(midAngle, radiusText, text);
    }

    //@ts-ignore
    function drawSector(radius, startAngle, endAngle, sectorFillColor) {
        ctx.save();

        ctx.fillStyle = sectorFillColor;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    //@ts-ignore
    function drawSectorText(middleAngle, radius, text) {
        ctx.save();

        ctx.fillStyle = textStyles.fillColor;
        ctx.font = textStyles.textFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.translate(centerX, centerY);
        ctx.rotate(middleAngle);
        ctx.fillText(text, radius, 0);

        ctx.restore();
    }

    return (
        <>
            {isDisplayAnimation && (
                <div className={styles.app__coin_icon_animation}>
                    <LottieAnimation animationData={coinAnimation} loop={0} autoplay={true} />
                </div>
            )}
            <audio ref={audioRef}>
                <source src={soundWheel} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <canvas
                ref={canvasRef}
                width={dpiWidth}
                height={dpiHeight}
                style={{ width: `${width}px`, height: `${height}px` }}
                id="canvas"
            />
            <div
                onClick={handleSpinButtonClick}
                className={`${styles.app__spin_button} ${!isAvailableToSpin || isNeedRotateSpinIcon ? styles.disable : ''}`}
            >
                <img
                    className={`${styles.app__spin_button__loader} ${isNeedRotateSpinIcon ? styles.rotate : ''}`}
                    src={loaderIcon}
                />
                <Typography fontSize={isMobile ? '42px' : '120px'} fontFamily="Roundy Rainbows, sans-serif">
                    SPin
                </Typography>
            </div>
        </>
    );
};

