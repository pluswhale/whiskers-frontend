import { CSSProperties, FC, ReactElement, useEffect, useState } from 'react';
import styles from './button.module.scss';

type Props = {
    text: string;
    subText?: string;
    fontSize?: string;
    height?: string;
    fontFamily?: string;
    boxShadow?: string;
    backgroundColor?: string;
    fontWeight?: string;
    imageLeft?: string;
    imageRight?: string;
    backgroundImage?: string;
    width?: string;
    textTransform?: any;
    borderRadius?: string;
    stylesForTexts?: { main: CSSProperties; sub: CSSProperties };
    onClick?: () => void;
    disabled?: boolean;
};

export const Button: FC<Props> = (props): ReactElement => {
    const {
        text,
        subText,
        fontSize = '16px',
        height = '',
        fontFamily,
        fontWeight,
        imageLeft,
        imageRight,
        backgroundImage,
        backgroundColor,
        width = '100%',
        textTransform = 'uppercase',
        borderRadius,
        stylesForTexts,
        disabled,
        onClick,
    } = props;

    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        const shakeInterval = setInterval(() => {
            setShouldShake(true);
            setTimeout(() => {
                setShouldShake(false);
            }, 500);
        }, 10_000); // Repeat the shake effect every 2 seconds

        return () => clearInterval(shakeInterval);
    }, []); // Run only once when the component mounts

    return (
        <button
            disabled={disabled || false}
            onClick={onClick || undefined}
            style={{
                fontSize,
                height,
                backgroundColor,
                fontFamily,
                fontWeight,
                width,
                textTransform,
                borderRadius,
                backgroundImage: backgroundColor
                    ? 'none'
                    : backgroundImage
                      ? backgroundImage
                      : 'linear-gradient(to bottom, #f2632e, #e93324)',
            }}
            className={styles.button}
        >
            {imageLeft && (
                <img className={`${styles.button__icon_left} ${shouldShake ? styles.shake : ''}`} src={imageLeft} />
            )}
            <div className={styles.button__text_conteiner}>
                <span style={stylesForTexts?.main || {}} className={styles.button__text_conteiner__text}>
                    {text}
                </span>
                <span style={stylesForTexts?.sub || {}} className={styles.button__text_conteiner__subtext}>
                    {subText}
                </span>
            </div>
            {imageRight && <img className={styles.button__icon_right} src={imageRight} />}
        </button>
    );
};

