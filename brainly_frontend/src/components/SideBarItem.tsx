import { ReactElement } from "react";

interface SideBarProps{
    text:String;
    icon:ReactElement;
}

export function SideBarItem(props: SideBarProps){
    return <div className="flex flex-row gap-5 pl-10 pt-10">
        <div>
        {props.icon}</div> <div>{props.text}</div>
    </div>
}