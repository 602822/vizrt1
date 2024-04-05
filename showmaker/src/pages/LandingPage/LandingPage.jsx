
import { useContext, useState } from "react";
import { Header } from "../../components/Header/Header";
import logo from '../../assets/logo.png'; 

// import "./LandingPage.css";
import { Chatbox } from "./../../components/Chatbox/Chatbox";
import { Rundwon } from "../../components/Rundown/Rundwon";
import { Title } from "../../components/Title/Title";
import data from "../../data/data";
import { ChatContext, ChatContextProvider } from "../../context/ChatContext";



export function LandingPage() {

    const {title} = useContext(ChatContext);

    console.log(title)
    const [isOpen, setIsOpen] = useState(false);

    function toggleChatbox() {
      setIsOpen(!isOpen);
    }

    return (
        <ChatContextProvider>
        <div className='relative w-full h-lvh'>

            <div className='flex flex-row justify-center items-center w-full h-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] fixed'><Header /></div>

            <div className='w-full flex justify-center h-[80vh] pt-10'>
                <div className='w-[15%] bg-gray-500 flex flex-col justify-start items-center truncate'>


                    <Title title={title} />
                </div>

                
                <div className='w-[70%]'><Rundwon /></div>

                <div className='w-[15%] bg-gray-500 flex flex-col justify-center items-center'>

                <button onClick={toggleChatbox} >
                    <img src={logo} alt="image" className="w-20 h-20 rounded-full" />
                </button>

                </div>

                    <div className={"absolute top-1/2 left-1/2 right-4 transform -translate-x-1/4 -translate-y-1/2 w-[600px] h-[600px] shadow-xl " + (isOpen ? "block" : "hidden") }>
                        <Chatbox />
                    </div>
               
            </div>

        
            <div className='h-48 bg-zinc-800'>Footer</div>

        </div>

     </ChatContextProvider>
    )
}
