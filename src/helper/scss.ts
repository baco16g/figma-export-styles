import dedent from 'dedent';

interface Typography {
  nodeId: string;
  styleName: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
}

export const build = (typographies: Typography[]) => {
  return dedent(
    typographies.reduce((acc, curr) => {
      return `${acc}
      @mixin ${curr.styleName.replace(/\//g, '_')} {
        font-family: "${curr.fontFamily}";
        font-size: ${curr.fontSize};
        font-weight: ${curr.fontWeight};
        line-height: ${curr.lineHeight};
        letter-spacing: ${curr.letterSpacing};
      }
    `;
    }, ''),
  );
};
