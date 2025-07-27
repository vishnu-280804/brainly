import { useState } from "react"
import { CrossIcon } from "../icons/CrossIcon"
import { Button } from "./Button"
import { backendURL } from "../config";
import axios from "axios"
import { useRef } from "react"
import { InputProps,Input } from "./Input"
enum ContentType{
    Youtube = "youtube",
    Twitter = "twitter"
}
export function CreateContentModel({open,onClose}: any){
    const [type,setType] = useState(ContentType.Youtube);
    const linkRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);

    async function submit(){
        const link = linkRef.current?.value;
        const title = titleRef.current?.value;

        try {
            if(!link || !title){
                alert("Please enter type or link");
                return;
            }
            
            const res = await axios.post(backendURL+"/api/v1/content",{
                link,
                title,
                type
            },{
                headers:{
                    "Authorization":localStorage.getItem("token")
                }
            });
    
            alert(res.data.message);
        } catch (error) {
            alert(error);
        }




    }

    return <div>
        {open &&<div> <div className="opacity-60 bg-slate-500 flex justify-center w-screen h-screen fixed top-0 left-0">
            <div className="flex flex-col justify-center">
            <div className="bg-white opacity-100 p-4 rounded">
               <div className="flex justify-end" onClick={onClose}>
                    <CrossIcon size="md" />
               
            </div>
            <div>
                <Input ref={titleRef} placeholder= {"Title"}  />
                <Input ref={linkRef}  placeholder={"Link"} />
            </div>
            <div>
                <h1>Type</h1>
                <div className="flex gap-4 pt-2">
                <Button onClick={()=>{setType(ContentType.Youtube)}} size="md" text={"Youtube"} variant = {type === ContentType.Youtube? "primary" : "secondary"}  />
                <Button onClick={()=>{setType(ContentType.Twitter)}} size="md" text={"Twitter"} variant = {type === ContentType.Twitter? "primary" : "secondary"}  />
                </div>
            </div>
                <div className="flex justify-center pt-4">
                <Button size="md" onClick={submit} variant="primary" text="submit" /></div>
            </div>
            </div>
            </div>
        </div>}
    </div>
}
