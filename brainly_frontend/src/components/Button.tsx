export interface ButtonProps{
    variant:"primary" | "secondary";
    size:"lg"|"md"|"sm";
    text: String;
    startIcon?: any;
    endIcon?: any;
    fullWidth?:any,
    loading?:Boolean
    onClick: ()=>void
}

const variantStyles = {
    "default" :"ph-10 rounded-md",
    "primary":"bg-[#5046e4] text-white p-4 ",
    "secondary":"bg-[#e0e7fe] text-[#5046e4] p-4"
}
const defaultStyles = "cursor-pointer rounded-md font-light"




const sizeStyles = {
    "sm":"py-1 px-2",
    "md":"py-2 px-4",
    "lg":"py-4 px-6"
}
export const Button = (props: ButtonProps)=>{
    //const variantClass = props.variant === "primary" ? "bg-white text-black" : "bg-black text-white";

    return (
  <button
    className={`${defaultStyles}  ${props.loading?"opacity-45":""} ${sizeStyles[props.size]} ${variantStyles[props.variant]} ${props.fullWidth ? "w-full" : ""}`}
    onClick={props.onClick}
  >
    <div className={`flex items-center ${props.fullWidth ? "justify-center w-full" : ""} `}>
      {props.startIcon && (
        <div className="pr-2">{props.startIcon}</div>
      )}
      <div className="pl-2 pr-2">{props.text}</div>
      {props.endIcon}
    </div>
  </button>
);


}


//Colors:
//1)#e0e7fe: 300 2)rgba(224,231,254,255) 3)purple 600:#5046e4  4)500: #3e38a7