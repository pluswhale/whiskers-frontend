import { FC, ReactElement } from 'react'

interface IconProps {
  style: any,
  src: string,
}

export const Icon: FC<IconProps> = ({ style, src }): ReactElement => {
  return(
    <div style={style}>
      <img style={{height: '100%', width: '100%', objectFit: 'contain'}} src={src} alt="icon" />
    </div>
  )
}