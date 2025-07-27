type InputProps = {
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?:any;
};

function Input(props: InputProps){
    return <div>
        <input ref={props.ref} placeholder={props.placeholder} type="text" onChange={props.onChange} className="px-4 m-2 py-2 border" />
    </div>
}

export {InputProps,Input};