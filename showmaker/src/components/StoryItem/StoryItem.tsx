import React from 'react'
import { StoryItemProp } from '../../types/globalTypes'

export function StoryItem({ storyItem }: { storyItem: StoryItemProp }) {
  
  const { type, variant, plannedDuration, bodyText } = storyItem;

  return (
    <div className='flex flex-row items-start mt-1 mb-1 w-full'>

      <div className='w-[10%] h-10 text-white bg-blue-500 flex justify-center items-center'>{plannedDuration}</div>
      <div className='w-[15%] h-10 text-white bg-red-500 flex justify-center items-center'>{type}</div>
      <div className='w-[15%] h-10 text-white bg-green-500 flex justify-center items-center'>{variant}</div>
      <div className='text-white text-sm p-1 h-10 bg-black w-[60%] overflow-fade'>{bodyText}</div>
      
    </div>
  )
}
