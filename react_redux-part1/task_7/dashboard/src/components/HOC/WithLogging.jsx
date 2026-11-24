import { Component } from 'react'

const WithLogging = (WrappedComponent) => {
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  // eslint-disable-next-line react-hooks/unsupported-syntax
  class WithLoggingComponent extends Component {
    componentDidMount() {
      console.log(`Component ${wrappedName} is mounted`)
    }

    componentWillUnmount() {
      console.log(`Component ${wrappedName} is going to unmount`)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  WithLoggingComponent.displayName = `WithLogging(${wrappedName})`

  return WithLoggingComponent
}

export default WithLogging
