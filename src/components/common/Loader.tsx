import React from 'react'
import './css/loader.css'

const Loader = () => {
  return (
    <div className="spinner-container">
      {/* <span>Loading...</span> */}
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

  )
}

export default Loader
