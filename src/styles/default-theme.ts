const defaultTheme = {
  fontFamily: "'Open Sans', sans-serif;",

  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightBold: '600',

  fontSizeXLarge: '1.8rem',
  fontSizeLarge: '1.6rem',
  fontSizeRegular: '1.3rem',

  blue1: '#23507A',
  blue2: '#2467A5',
  blue3: '#7FB9EF',
  gray1: '#35383A',
  gray2: '#464D53',
  gray3: '#6E7781',
  gray4: '#98989F',
  gray5: '#D8D8E0',
  gray6: '#EAEAF2',
  green1: '#219653',
  green2: '#27AE60',
  green3: '#6FCF97',
  orange1: '#F2994A',
  purple1: '#9B51E0',
  purple2: '#BB6BD9',
  red1: '#EB5757',
  yellow1: '#F2C94C',

  viewportSmall: '600px',
  viewportMedium: '800px',
  viewportLarge: '1100px',
  viewportXLarge: '1400px',

  maxWidth: '1650px',
};

export default defaultTheme;
export type Theme = typeof defaultTheme;
