import { useState } from 'react'
import {Provider} from 'react-redux'
import { RouterComponent } from './RouterComponent'
import { store } from './config/store'

function App() {
  return (
    <Provider store={store}>
      <RouterComponent />
    </Provider>
  )
}

export default App
