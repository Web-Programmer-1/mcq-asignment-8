import React from "react"
import Navbar from "../_components/Navbar"
import Footer from "../_components/_Footer/Footer"


interface IChildren {
    children:React.ReactNode
}


export default function PublicLayout({children}:IChildren) {
  return (
    <div>
     <Navbar></Navbar>
      {children}

      <Footer></Footer>
    </div>
  )
}
