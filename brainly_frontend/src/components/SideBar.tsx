import { SideBarItem } from "./SideBarItem";
import { TwitterIcon } from "../icons/TwitterIcon";
import { TagIcon } from "../icons/TagIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { DocIcon } from "../icons/DocIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import image from "../icons/Brain.png"
import { text } from "express";
export function SideBar(){
    return <div className="h-screen w-72 bg-white border  position-fixed  absolute">
        <div className="flex flex-row gap-2">
            <img src={image} className="h-[80px]" alt="" />
        <h1 className="pt-6 text-3xl font-bold">Second Brain</h1></div>
        <div className="flex flex-col hover:cursor-pointer ">
            <div className="hover:bg-gray-200 pb-7 ">
        <SideBarItem icon={<TwitterIcon size="lg" />} text={"Tweets"}  /></div>
          <div className="hover:bg-gray-200 pb-7">
        <SideBarItem icon={<YoutubeIcon size="lg" />} text={"Videos"}  /></div>
         <div className="hover:bg-gray-200 pb-7">
        <SideBarItem icon={<DocIcon size="lg" />} text={"Documents"} /></div>
         <div className="hover:bg-gray-200 pb-7">
        <SideBarItem icon={<LinkIcon size="lg" />} text={"Links"} /></div>
         <div className="hover:bg-gray-200 pb-7">
        <SideBarItem icon={<TagIcon size="lg" />} text={"Tags"} /></div>

        </div>
    </div>
}