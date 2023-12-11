import RainCanvas from './RainCanvas'
import './App.css'
import Sender from './Sender'
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Sender />} />
        <Route path="/screen/:id" exact element={<RainCanvas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
