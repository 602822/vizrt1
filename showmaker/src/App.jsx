
import {BrowserRouter, Routes, Route} from "react-router-dom";


import { LandingPage } from './pages/LandingPage/LandingPage';

import{ChatContextProvider} from "./context/ChatContext";


export default function App() {
  return (
    
    <BrowserRouter>
    <ChatContextProvider>
   <Routes>

     <Route path="/" element={<LandingPage/>} />
 
     
   </Routes>
   </ChatContextProvider>
   </BrowserRouter>
   
  );
}
