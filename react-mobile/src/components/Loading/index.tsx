import { useEffect } from "react"
import "./index.less"

const Loading = (props: any) => {
  const { type } = props
  const dom1 = (
    <>
      <div className="container1">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
        <div className="circle circle4"></div>
      </div>
      <div className="container2">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
        <div className="circle circle4"></div>
      </div>
    </>
  )

  const dom2 = (
    <>
      <div className="bounce-view">
        <div className="bounce bounce1"></div>
        <div className="bounce bounce2"></div>
        <div className="bounce bounce3"></div>
      </div>
    </>
  )

  const dom3 = (
    <>
      <div className="wave">
        <div className="react react1"></div>
        <div className="react react2"></div>
        <div className="react react3"></div>
        <div className="react react4"></div>
        <div className="react react5"></div>
      </div>
    </>
  )

  return <div className="loading">{dom3}</div>
}

// export const withLoading = (WrappedComponent: any) => (props: any) => {
//   const { loading } = props
//   const tempProps = { ...props, loading: undefined }
//   return (
//     <>
//       {loading && <Loading></Loading>}
//       <WrappedComponent {...tempProps} />
//     </>
//   )
// }


export default Loading