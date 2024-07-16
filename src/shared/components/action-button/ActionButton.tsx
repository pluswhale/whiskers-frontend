import { CSSProperties, FC, ReactElement } from 'react';
import styles from './action-button.module.scss'

type Props = {
  text: string;
  subText?: string;
  fontSize?: string;
  height?: string;
  fontFamily?: string;
  boxShadow?: string;
  backgroundColor?: string;
  fontWeight?: string;
  imageLeft?: any;
  textRight?: string;
  subTextRight?: string;
  backgroundImage?: string;
  width?: string;
  textTransform?: any;
  borderRadius?: string;
  gap?: string;
  stylesForTexts?: { main: CSSProperties; sub: CSSProperties };
  stylesForTextsRight?: { main: CSSProperties; sub: CSSProperties };
  onClick?: () => void;
  disabled?: boolean;
};

export const ActionButton: FC<Props> = (props): ReactElement => {
  const {
      text,
      subText,
      imageLeft,
      textRight,
      subTextRight,
      fontSize = '16px',
      height = '',
      fontFamily,
      fontWeight,
      backgroundImage,
      backgroundColor,
      width = '100%',
      textTransform = 'uppercase',
      borderRadius,
      gap,
      stylesForTexts,
      stylesForTextsRight,
      disabled,
      onClick,
  } = props;

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
              gap,
              backgroundImage: backgroundColor
                  ? 'none'
                  : backgroundImage
                    ? backgroundImage
                    : 'linear-gradient(330deg, #252739 30%, #14162b)',
          }}
          className={styles.button}
      >
        {/* {imageLeft && <img className={`${styles.button__icon_left}`} src={imageLeft} />} */}
        {imageLeft}
        <div className={styles.button__text_conteiner}>
            <span style={stylesForTexts?.main || {}} className={styles.button__text_conteiner__text}>
                {text}
            </span>
            <span style={stylesForTexts?.sub || {}} className={styles.button__text_conteiner__subtext}>
                {subText}
            </span>
        </div>
        <div>
          {textRight && <p style={stylesForTextsRight?.main}>{textRight}</p>}
          {subTextRight && <p style={stylesForTextsRight?.sub}>{subTextRight}</p>}
        </div>
      </button>
  );
};