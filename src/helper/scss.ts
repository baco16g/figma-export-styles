import dedent from 'dedent'

interface Typography {
  nodeId: string
  styleName: string
  fontFamily: string
  fontSize: string
  fontWeight: number
  letterSpacing: number
  lineHeight: number
}

interface Fill {
  nodeId: string
  styleName: string
  hex: string
}

export const buildTypography = (typographies: Typography[]) => {
  return dedent(
    typographies.reduce((acc, curr) => {
      return `${acc}
      @mixin ${formatStyleName(curr.styleName)} {
        font-family: "${curr.fontFamily}";
        font-size: ${curr.fontSize};
        font-weight: ${curr.fontWeight};
        line-height: ${curr.lineHeight};
        letter-spacing: ${curr.letterSpacing};
      }
    `
    }, ''),
  )
}

export const buildFill = (fills: Fill[]) => {
  return dedent(
    fills.reduce((acc, curr) => {
      return `${acc}$color-${formatStyleName(curr.styleName)}: ${curr.hex};
    `
    }, ''),
  )
}

const formatStyleName = (s: string) => s.replace(/(\/|\s)/g, '_');
