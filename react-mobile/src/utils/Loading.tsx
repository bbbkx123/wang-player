
export const withLoading = (WrappedComponent: any) => {
  const WithLoading = (props: any) => {
    const {loading} = props
    if (loading) {
      return <div>loading...</div>
    } else {
      const tempProps = {...props, loading: undefined}
      return <WrappedComponent {...tempProps}/>
    }
  }
  return WithLoading
}