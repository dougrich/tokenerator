import { css } from '@emotion/core'
import styled from '@emotion/styled'
import Link from 'next/link'
import withAttrs from '../src/with-attrs'
import { Row, Label } from '@dougrich/uxlib'

export {
  Row,
  Label
}

const colors = {
  borderblack: '#333',
  accent: '#D00'
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

export const Navigation = styled.nav(props => ({
  margin: 0,
  marginBottom: '1.5em',
  opacity: props.disabled ? 0.5 : 1,
  pointerEvents: props.disabled ? 'none' : null,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  '&>*': {
    marginTop: '1em!important',
    width: '10em'
  },
  '@media (min-width: 600px)': {
    flexDirection: 'row'
  }
}))

export const Title = styled.h1(props => [
  props.theme.typography.title,
  {
    margin: 0,
    fontSize: '1.5em',
    lineHeight: '2em',
    '@media (min-width: 600px)': {
      fontSize: '2em',
      lineHeight: '3em'
    },
    '@media (min-width: 800px)': {
      fontSize: '3em',
      lineHeight: '3em'
    }
  }
])

export const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: auto;
`

export const Article = styled.article(props => [
  {
    padding: '2em',
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
  [300, 75],
  [400, 100],
  [500, 125],
  [600, 150],
  [800, 200],
  [1200, 300],
  [1500, 300],
  [2000, 400],
  [2400, 400]
].map(([gridwidth, size]) => ({
  query: `@media (min-width: ${gridwidth}px)`,
  size: `${gridwidth}px`,
  item: `${size}px`
}))

const { itemstyle, gridstyle } = gridBreakpoints.reduce(({ itemstyle, gridstyle }, { query, size, item }) => ({
  itemstyle: {
    ...itemstyle,
    [query]: {
      width: item,
      height: item
    }
  },
  gridstyle: {
    ...gridstyle,
    [query]: {
      width: size
    }
  }
}), {
  itemstyle: {
    width: '100px',
    height: '100px'
  },
  gridstyle: {
    margin: 'auto',
    width: '300px'
  }
})

export const Grid = styled.div(gridstyle)

export const GridItem = css(itemstyle)

export const DefaultText = styled.div`
  font-style: italic;
  text-align: center;
  opacity: 0.8;
`

export const TokenTitle = styled.h2`
  ${typography.title}
`

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

export const Action = styled.button(props => [
  props.theme.typography.body,
  props.disabled
    ? {
      pointerEvents: 'none',
      opacity: 0.2
    }
    : {},
  {
    height: '1.5em',
    display: 'inline-block',
    position: 'relative',
    background: 'transparent',
    textDecoration: 'none',
    textAlign: 'center',
    color: 'black',
    cursor: 'pointer',
    border: 0,
    margin: '0em 1em',
    padding: '0em 0.5em',
    '&:after': {
      content: "''",
      position: 'absolute',
      bottom: '-2px',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: 'black',
      transform: 'scale(0.5,1)',
      transition: '200ms transform, 200ms background-color'
    },
    '&:hover,&:focus': {
      color: '#D00'
    },
    '&:hover:after,&:focus:after': {
      transform: 'scale(1,1)',
      backgroundColor: '#D00'
    },
    '&:focus': {
      outline: '2px dashed #D00'
    },
    '@media print': {
      display: 'none'
    }
  }
])

export const ActionRow = styled.div({
  display: 'flex',
  justifyContent: 'space-around'
})

export const ActionLink = (props) => {
  if (props.disabled) {
    return (
      <Action as='a' disabled>
        {props.children}
      </Action>
    )
  }
  return (
    <Link
      {...props}
      passHref
    >
      <Action as='a'>
        {props.children}
      </Action>
    </Link>
  )
}

const TokenShadowContainer = withAttrs({
  viewBox: '0 0 90 90'
})(styled.svg({
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  display: 'block'
}))

export const TokenShadow = () => (
  <TokenShadowContainer>
    <circle cx='45' cy='45' r='36' fill='#e3e3e3' />
  </TokenShadowContainer>
)

export const ModalContainer = styled.div({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  padding: '2em',
  border: '1px solid #d9d9d9',
  borderRadius: '0.25em'
})

export const TextCenter = styled.div({
  textAlign: 'center'
})

export const NotPrint = styled.div({
  display: 'block',
  '@media print': {
    display: 'none'
  }
})
