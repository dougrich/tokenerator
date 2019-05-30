import { jsx, css } from '@emotion/core'
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
  header: css`
    font-family: 'Oswald', sans-serif;
    text-align: left;
    border-bottom: ${measure.border} solid ${colors.borderblack};
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
  ${row}
`

export const Title = styled.h1`
  ${typography.title}
  font-size: 3em;
  margin: 0;
`

export const Container = styled.div`
  max-width: 500px;
  width: 100%;
  margin: auto;
`

export const Header = styled.header`
  width: calc(100vw - 4em);
  border-bottom: ${measure.border} solid ${colors.borderblack};
  margin: 0.5em 2em;
  position: relative;
  transition: ${timing.navigation} margin-top;
`

const NavigationLinkStyled = styled.a`
  ${typography.title}
  width: 100%;
  cursor: pointer;  
  font-size: 1.5em;
  color: ${colors.borderblack};
  text-decoration: none;
  padding-top: 0.25em;
  padding-bottom: 0.15em;
  margin: 0em 0.5em;
  position: relative;
  transition: ${timing.navigation} color;

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

export const Article = styled.article`
  h1, h2, h3, h4 {
    ${typography.header};
  }

  pre {
    white-space: pre-wrap;
    background-color: #F3F3F3;
    padding: 1em;
  }

  p {
    ${typography.body};
  }
`

const gridBreakpoints = [
  [400, 100],
  [600, 150],
  [800, 200],
  [1200, 300],
  [1600, 400],
  [2000, 500],
  [2500, 500],
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

export const DefaultTokenPreviewTitle = styled.div`
  font-style: italic;
`

export const TokenPreviewImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`