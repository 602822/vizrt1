import React, { useContext, useEffect } from "react";
import data from "../../data/data";
import { Story } from "../Story/Story";
import { StoryProp } from "../../types/globalTypes";
import { ChatContext } from "../../context/ChatContext";
import { StoryItem } from "../StoryItem/StoryItem";


export function Rundwon() {

  const {items}= useContext(ChatContext);

  const {name,stories} = data;

  // const {items} = stories[0];

  const story:StoryProp = {
    id: "1",
    storyPlannedDuration: 0,
    items: [],
  }


  return (
    <div>
    {/* <h1>{name}</h1> */}
    {/* <Story story={stories[0]}/> */}

    {
      items?.map(function (item) {
        return <StoryItem storyItem={item} key={item?.id}/>
      })
    }
    </div>
  )
}
