/**
 * Helper function to bake attributes into a component
 */
export default (attrs) => (Component) => (props) => (
  <Component {...attrs} {...props}>
    {props.children}
  </Component>
)
