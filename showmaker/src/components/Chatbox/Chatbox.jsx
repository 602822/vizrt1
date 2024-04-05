
import { ChatInput } from '../ChatInput/ChatInput';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import { Link } from "react-router-dom";
import { buttonVariants } from '../ui/Button';
import {Messages} from '../Messages/Messages';
import { ChatContext, ChatContextProvider } from '../../context/ChatContext';
import { useContext } from 'react';
import { UploadStatus } from '../../types/globalTypes';

export function Chatbox() {


  const {message,state} = useContext(ChatContext);


  function fetchData() {

    if (state == UploadStatus.LOADING) {
      return "LOADING"
    } 
    else if (state == UploadStatus.ERROR) {

      return "FAILED"
    }
    return "SUCCESS"
  }

  if (fetchData() === 'LOADING') {

    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Loading...
            </h3>
            <p className='text-zinc-500 text-sm'>
              This won&apos;t take long.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
  )
}

  if (fetchData() === 'FAILED')
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <XCircle className='h-8 w-8 text-red-500' />
            <h3 className='font-semibold text-xl'>
              Something went wrong
            </h3>
          </div>
        </div>

        <ChatInput isDisabled={false}/>
      </div>
    )
  return (
    <div className='relative min-h-full bg-zinc-200 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
    <div className='flex-1 justify-between flex flex-col mb-28'>
      <Messages />
    </div>
    <ChatInput />
  </div>
  )
}
