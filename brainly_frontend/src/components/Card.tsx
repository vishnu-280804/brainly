
import { ShareIcon } from "../icons/ShareIcon";
import { BinIcon } from "../icons/BinIcon";
import { DocIcon } from "../icons/DocIcon";
import { useState } from "react";
import { backendURL } from "../config";
import axios from "axios";
interface CardProps{
    title: String,
    link: string,
    typeLink: "twitter" | "youtube",
    _id?:any

}


export function Card(props: CardProps){
    const [del,setDel] = useState(false);
    const handleDelete = async ()=>{
        const res = axios.delete(backendURL+"/api/v1/content",{
            data:{
                id:props._id
            },
            headers:{
                Authorization:localStorage.getItem("token")
            }
        })
    }

    function check(iframeHtml: string): any{
        const match = iframeHtml.match(/src="([^"]+)"/);
        return match?match[1]:"";
    }
    let src1: any = "";
    if(props.typeLink === "youtube") src1 = check(props.link);
    return <div className="max-w-78 min-h-40 p-8 gap-4 max-h-70 border bg-white rounded-lg border-gray-200 outline-slate-200 ">
        <div className="flex justify-between">
            <div className="flex text-sm ">
                <div className=" pr-3 font-bold">
                <DocIcon size="md" /></div>
                <div className="font-semibold pb-3">{props.title}</div>
            </div>
            <div className="flex gap-2">
                <ShareIcon size="md"/>
                <div onClick={handleDelete}><BinIcon size="md" /></div>
        </div>
        </div> 
        <div  className="pr[100px]">
          {props.typeLink === "twitter" &&  <div><blockquote className="twitter-tweet  w-full " data-theme="dark" data-dnt="true" ><p lang="en" dir="ltr">Building a Second Brain application through <a className="mr-[100px]" href="https://twitter.com/kirat_tw?ref_src=twsrc%5Etfw">@kirat_tw</a>’s cohort. Learning TypeScript <a href="https://t.co/FwZcZTnWQa">pic.twitter.com/FwZcZTnWQa</a></p>&mdash; Saivishnu Reddy (@SaivishnuR80632) <a href="https://twitter.com/SaivishnuR80632/status/1946799391358300220?ref_src=twsrc%5Etfw">July 20, 2025</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script></div> }
          
       { props.typeLink === "youtube"  && <div><iframe className="w-full"  src={src1} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe></div> }
        </div>
    </div>
}