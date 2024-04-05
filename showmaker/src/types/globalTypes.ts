
export enum UploadStatus {
    LOADING,
    SUCCESS,
    ERROR
}

export interface MessageProps {
    id: string;
    text: string | React.ReactNode;
    isUserMessage: boolean;
    createdAt: string 
}



export enum TimelineState {
    Stopped = "Stopped",
    Running = "Running",
    Paused = "Paused",
  }


export interface RundownProp {
    id?: string | null
    name?: string | null
    stories?: StoryProp[] | null
  }


  export interface StoryProp {
    id?: string | null
    storyPlannedDuration?: number
    items?: StoryItemProp[] | null
  }

  export interface StoryItemProp {
    id?:string | null
    type?: string | null
    variant?: string | null
    plannedDuration?: number
    bodyText?: string | null
  }

  
