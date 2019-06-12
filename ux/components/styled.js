import { css } from '@emotion/core'
import styled from '@emotion/styled'
import Link from 'next/link'

const colors = {
  borderblack: '#333',
  accent: '#D00'
}

const measure = {
  border: '2px'
}

const timing = {
  navigation: '100ms ease-in-out'
}

const typography = {
  title: css`
    font-family: 'Oswald', sans-serif;
    text-align: center;
  `,
  body: css`
    font-family: 'Open Sans', sans-serif;
    line-height: 1.5em;
  `
}

const row = css`
  margin: 0;
  margin-bottom: 1em;
`

export const Navigation = styled.nav`
  display: flex;
  justify-content: space-around;
  ${row}
`

export const Row = styled.div(row)

export const Title = styled.h1(props => [
  props.theme.typography.title,
  {
    margin: 0
  }
])

export const Container = styled.div`
  max-width: 500px;
  width: 100%;
  margin: auto;
`

export const Header = styled.header`
  border-bottom: ${measure.border} solid ${colors.borderblack};
  margin: 0.5em 2em;
  position: relative;
`

export const NavigationLinkStyled = styled.a`
  ${typography.title}
  width: 100%;
  max-width: 6em;
  cursor: pointer;  
  font-size: 1.5em;
  color: ${colors.borderblack};
  text-decoration: none;
  padding-top: 0.25em;
  padding-bottom: 0.15em;
  margin: 0em 0.5em;
  position: relative;
  transition: ${timing.navigation} color;
  background: transparent;
  border: 0;

  &:after {
    content: '';
    position: absolute;
    bottom: -${measure.border};
    left: 0;
    right: 0;
    height: ${measure.border};
    background-color: ${colors.borderblack};
    transform: scale(0.5, 1);
    transition: ${timing.navigation} transform, ${timing.navigation} background-color;
  }

  &:hover, &:focus {
    color: ${colors.accent};
  }

  &:hover:after, &:focus:after {
    transform: scale(1, 1);
    background-color: ${colors.accent};
  }

  &:focus {
    outline: ${measure.border} dashed ${colors.accent};
  }
`

export const NavigationLink = (props) => (
  <Link
    {...props}
    passHref
  >
    <NavigationLinkStyled>
      {props.children}
    </NavigationLinkStyled>
  </Link>
)

export const Article = styled.article(props => [
  {
    'h1, h2, h3, h4': props.theme.typography.header,
    'pre': {
      whiteSpace: 'pre-wrap',
      backgroundColor: '#F3F3F3',
      padding: '1em'
    },
    'p': props.theme.typography.body
  }
])

const gridBreakpoints = [
  [400, 100],
  [600, 150],
  [800, 200],
  [1200, 300],
  [1600, 400],
  [2000, 500],
  [2500, 500]
].map(([gridwidth, size]) => ({
  query: `@media (min-width: ${gridwidth}px)`,
  size: `${gridwidth}px`,
  item: `${size}px`
}))

const gridstyle = gridBreakpoints.map(({ query, size }) => `
  ${query} {
    width: ${size};
  }
`).join('\n')

const itemstyle = gridBreakpoints.map(({ query, item }) => `
  ${query} {
    width: ${item};
    height: ${item};
  }
`).join('\n')

export const Grid = styled.div`
  margin: auto;
  ${gridstyle}
`

export const TokenPreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  ${itemstyle}

  &:hover>div, &:focus>div {
    transform: translate(-50%, 0%);
    background-color: rgba(0,0,0,0.75);
  }
`

export const TokenPreviewTitle = styled.div`
  position: absolute;
  pointer-events: none;
  top: 50%;
  left: 0;
  width: 100%;
  font-size: 2em;
  color: white;
  background-color: transparent;
  padding-top: 1em;
  padding-bottom: 1em;
  padding-left: 100%;
  text-align: center;
  transform: translate(0%, 0%);
  transition: ${timing.navigation} transform, ${timing.navigation} background-color;
  ${typography.title}
`

export const DefaultText = styled.div`
  font-style: italic;
  text-align: center;
  opacity: 0.8;
`

export const TokenPreviewImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const TokenTitle = styled.h2`
  ${typography.title}
`

export const Button = styled.button`
  ${typography.body}
  position: relative;
  background-color: black;
  border-radius: 2px;
  padding: 1em;
  width: 6em;
  color: white;
  text-decoration: none;
  transition: ${timing.navigation} color;
  display: inline-block;
  text-align: center;
  margin: 1em;

  &:after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    height: ${measure.border};
    background-color: white;
    transform: scale(0.5, 1);
    transition: ${timing.navigation} transform, ${timing.navigation} background-color;
  }

  &:hover, &:focus {
    color: ${colors.accent};
  }

  &:hover:after, &:focus:after {
    transform: scale(0.75, 1);
    background-color: ${colors.accent};
  }

  &:focus {
    outline: ${measure.border} dashed ${colors.accent};
  }
`

export const Label = styled.label(props => [
  props.theme.typography.subheader,
  {
    color: '#444',
    display: 'block',
    marginBottom: '0.25em',
    marginRight: '1em'
  }
])

export const TextInputUnderline = styled.div({
  position: 'absolute',
  bottom: -2,
  left: 0,
  right: 0,
  height: 2,
  backgroundColor: colors.borderblack,
  pointerEvents: 'none',
  transform: 'scale(0.5, 1)',
  transformOrigin: 'bottom left',
  transition: '200ms transform',
  'input:hover+&,input:focus+&,textarea:hover+&,textarea:focus+&': {
    transform: 'scale(1,1)',
    backgroundColor: '#D00'
  }
})

export const TextAreaLines = styled.div({
  position: 'absolute',
  left: -2,
  bottom: -2,
  top: 0,
  right: 0,
  width: 'auto',
  height: 'auto',
  borderColor: colors.borderblack,
  borderTop: '0!important',
  borderRight: '0!important',
  borderWidth: '4px',
  borderStyle: 'solid',
  pointerEvents: 'none',
  transform: 'scale(0.5, 0.5)',
  transformOrigin: 'bottom left',
  transition: '200ms transform, 200ms border-width',
  'input:hover+&,input:focus+&,textarea:hover+&,textarea:focus+&': {
    transform: 'scale(1,1)',
    borderWidth: '2px',
    borderColor: '#D00'
  }
})

const TextInputPositioning = css({
  padding: '0.5em',
  textAlign: 'left',
  width: 'calc(100% - 1em)!important',
  maxHeight: '10em'
})
export const TextInput = styled.input(props => [
  props.theme.typography.body,
  TextInputPositioning,
  {
    display: 'block',
    background: 'transparent',
    border: 0,
    marginRight: 0,
    position: 'relative',
    outlineOffset: '0px',
    '&:focus': {
      outline: '2px dashed #D00'
    },
    'textarea&': {
      height: '10em'
    }
  }
])

export const TextAddon = styled.div(props => [
  props.theme.typography.body,
  TextInputPositioning,
  {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: props.theme.focused ? 0 : 0.5,
    pointerEvents: 'none',
    whiteSpace: 'nowrap'
  }
])

export const TextMeasure = styled.span({
  opacity: 0
})

export const TextContainer = styled.div({
  position: 'relative',
  width: '100%'
})

export const HiddenSvg = styled.svg({
  height: '0',
  position: 'absolute',
  pointerEvents: 'none'
})

export const Flex = styled.div({
  display: 'flex',
  maxWidth: '1200px',
  margin: 'auto'
})
