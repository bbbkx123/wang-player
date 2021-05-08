import React from "react"

// const styles = {
//   container: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     width: "100vw",
//     height: "100vh",
//     padding: "0 20px",
//     backgroundColor: "#F4C272",
//   },
//   titleText: {
//     paddingTop: 20,
//     textAlign: "center",
//   },
//   btnGroup: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 20,
//   },
// }

export const HomePage = (props: any) => {
  const { history } = props

  const goToPage = (pathname: any) => {
    history.push({ pathname })
  }

  const goToAboutPage = () => {
    goToPage("/about")
  }

  const goToListPage = () => {
    goToPage("/list")
  }

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100vw", height: "100vh", padding: "0 20px", backgroundColor: "#F4C272" }}>
      <h1 style={{ paddingTop: 20, textAlign: "center" }}>This is HomePage</h1>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
        <button onClick={goToAboutPage}>Go to AboutPage</button>
        <button onClick={goToListPage}>Go to ListPage</button>
      </div>
    </div>
  )
}

export const AboutPage = (props: any) => {
  const { history } = props
  const onBack = () => {
    history.goBack()
  }

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100vw", height: "100vh", padding: "0 20px", backgroundColor: "#6D4DC2" }}>
      <h1 style={{ paddingTop: 20, color: "#FFF", textAlign: "center" }}>This is AboutPage</h1>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
        <button onClick={onBack}>return</button>
      </div>
    </div>
  )
}
