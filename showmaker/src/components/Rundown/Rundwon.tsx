import React, { useContext, useEffect } from "react";
import data from "../../data/data";
import { Story } from "../Story/Story";
import { StoryProp } from "../../types/globalTypes";
import { ChatContext } from "../../context/ChatContext";
import { StoryItem } from "../StoryItem/StoryItem";


export function Rundwon() {

  const {items, stories}= useContext(ChatContext);

  //const {name,stories} = data;

  const story:StoryProp = {
    id: "1",
    storyPlannedDuration: 0,
    items: [],
  }

  return (
    <div>
      
        {stories?.map((story) => (
          <div className='mb-5'>
          <React.Fragment key={story?.id} >
            <Story story={story} />
          </React.Fragment>
          </div>
        ))}
      
    </div>
  )
}
