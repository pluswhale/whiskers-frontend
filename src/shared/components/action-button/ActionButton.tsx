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

export const ActionButton: FC<Props> = (props): ReactElement => {
  const {
      text,
      subText,
      fontSize = '16px',
      height = '',
      fontFamily,
      fontWeight,
      backgroundImage,
      backgroundColor,
      width = '100%',
      textTransform = 'uppercase',
      borderRadius,
      stylesForTexts,
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
              backgroundImage: backgroundColor
                  ? 'none'
                  : backgroundImage
                    ? backgroundImage
                    : 'linear-gradient(135deg, #13152b, #252637)',
          }}
          className={styles.button}
      >
          <div className={styles.button__text_conteiner}>
              <span style={stylesForTexts?.main || {}} className={styles.button__text_conteiner__text}>
                  {text}
              </span>
              <span style={stylesForTexts?.sub || {}} className={styles.button__text_conteiner__subtext}>
                  {subText}
              </span>
          </div>
      </button>
  );
};

