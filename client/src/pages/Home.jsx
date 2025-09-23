import React from 'react'
import App from '../App'
import Header from '../components/Header'
import Steps from '../components/Steps'
import BgSlider from '../components/BgSlider'
import Upload from '../components/Upload'

const home = () => {
  return (
    <>
      <div>
        <Header />
        <Steps />
        <BgSlider />
        <Upload />
      </div>
    </>
  )
}

export default home