import React from 'react'

import { StoryProp } from '../../types/globalTypes';
import { StoryItem } from '../StoryItem/StoryItem';

export function Story({story}:{story:StoryProp}) {


  const {storyPlannedDuration,items} = story;

  return (
    <div>

      {/* <h1>{storyPlannedDuration}</h1> */}
      
      <div>

        {items?.map(function (item) {
          return <div><StoryItem storyItem={item} key={item?.id}/></div>
        })}
        
    </div>
    </div>
  )
}
