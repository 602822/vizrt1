import React from 'react'

import { Loader2, MessageSquare } from "lucide-react";
import Skeleton from 'react-loading-skeleton'
import { useContext } from "react"
import {Message} from "../Message/Message"
import { ChatContext } from "../../context/ChatContext";



export function Messages() {


// load messages from the backend
  const {messages, isLoading} = useContext(ChatContext);


  // const lastMessageRef = useRef<HTMLDivElement>(null);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    text: (
      <span className='flex h-full items-center justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </span>
    ),
  }

  const combinedMessages = [
    ...(isLoading ? [loadingMessage] : []),
    ...(messages ?? []),
  ];


  return (
  <div className='flex max-h-[calc(100vh-15.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
    {combinedMessages && combinedMessages.length > 0 ? (
      combinedMessages.map((message, i) => {

        const isNextMessageSamePerson = combinedMessages[i - 1]?.isUserMessage === combinedMessages[i]?.isUserMessage
          return (
            <Message message={message}isNextMessageSamePerson={isNextMessageSamePerson} key={message.id}/>
          )
      })
    ) : isLoading ? (
      <div className='w-full flex flex-col gap-2'>
        <Skeleton className='h-16' />
        <Skeleton className='h-16' />
        <Skeleton className='h-16' />
        <Skeleton className='h-16' />
      </div>
    ) : (
      <div className='flex-1 flex flex-col items-center justify-center gap-2'>
        <MessageSquare className='h-8 w-8 text-blue-500' />
        <h3 className='font-semibold text-xl'>
          You&apos;re all set!
        </h3>
        <p className='text-zinc-500 text-sm'>
          Write a prompt to get started.
        </p>
      </div>
    )}
  </div>
  )
}
