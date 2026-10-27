
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import MainRoute from './Route/MainRoute'

const App = () => {
  return (
    <BrowserRouter>
      <MainRoute />
    </BrowserRouter>
  )
}

export default App
