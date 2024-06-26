// src/components/Typography.tsx
import React from 'react';
import './typography.scss'; // Make sure to create this CSS file

interface TypographyProps {
    variant?: 'body1' | 'body2' | 'caption' | 'button' | 'overline';
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    color?: string;
    className?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
    variant = 'body1',
    align = 'inherit',
    color = 'default',
    className = '',
    children,
    fontFamily = "'Montserrat', sans-serif",
    fontSize = '16px',
    fontWeight = 'normal',
    ...props
}) => {
    const Component = variant === 'caption' || variant === 'overline' ? 'span' : 'p';

    const style = {
        textAlign: align,
        color: color !== 'default' ? color : undefined,
        fontFamily: fontFamily,
        fontSize,
        lineHeight: fontSize,
        fontWeight
    };

    return (
        <Component className={`${variant} ${className}`} style={style} {...props}>
            {children}
        </Component>
    );
};

