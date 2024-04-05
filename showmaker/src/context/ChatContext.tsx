import React from 'react';

import {ReactNode,createContext,useState} from 'react'

  
import { MessageProps, StoryItemProp, UploadStatus } from '../types/globalTypes';
import { generateUniqueId } from '../services/helperFunctions';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


interface ChatContextType {
  addMessage(): void;
  message: string;
  messages: MessageProps[];
  items: StoryItemProp[];
  title:string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  state: UploadStatus;
}


export const ChatContext = createContext<ChatContextType>({
  addMessage: () => {},
  message: '',  
  messages: [],
  items: [],
  title: '',
  handleInputChange: () => {},
  isLoading: false,
  state: UploadStatus.SUCCESS,

});




export function ChatContextProvider({children}: {children: ReactNode}){

  const [message, setMessage] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessageProps[]>([]);

  const[items, setItems] = useState<StoryItemProp[]>([]);

  const[title, setTitle] = useState<string>('');

  const [state, setState] = useState<UploadStatus>(UploadStatus.SUCCESS);

  async function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {

    e.preventDefault();

    console.log(e.target.value);

    setMessage(e.target.value);
  }




  async function addMessage() {

    const newMessage: MessageProps = {
      id: generateUniqueId(),
      text: message,
      isUserMessage: true,
      createdAt: new Date().toISOString(),
    }
    setMessages([...messages, newMessage]);

    messages.unshift(newMessage);

  // call the backend

    try {

      setIsLoading(true);

      setState(UploadStatus.LOADING);

      console.log(message);
      
      const response = await axios.post('http://127.0.0.1:3000/',{"message": message},{ headers: {
          'Content-Type': 'application/json'
        } });

        const data = await response.data;

        console.log(data);

        const newMessage: MessageProps = {
          id: generateUniqueId(),
          text: "The is generated response",
          isUserMessage: false,
          createdAt: new Date().toISOString(),
        }
        console.log(data.name);
        

    

        setMessages([newMessage, ...messages]);

        messages.unshift(newMessage);
        

        setItems(data.stories[0].items);

        setTitle(data.name);

        console.log(title);

       setState(UploadStatus.SUCCESS);

   
    } catch (error: any) {

      setState(UploadStatus.ERROR);

    } finally {

      setIsLoading(false);
      setMessage('');
    }


    console.log("add message");


  }


  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        messages,
        items,
        title,
        handleInputChange,
        isLoading,
        state
      }}>
      {children}
    </ChatContext.Provider>
  )
}


