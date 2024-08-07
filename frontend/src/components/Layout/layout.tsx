import { AppBar } from "../AppBar"
// import { RightBar } from "../Rightbar"
import { Leftbar } from "../leftbar"

export const Layout = (props:any) =>{
    return (
        <div className=" flex flex-col">
        <AppBar />
        <div className="flex justify-center ">
            <div className="w-1/5 border-r"><Leftbar /></div>
            <div  className="w-4/5 overflow-y-auto flex justify-center flex-col">
                {props.children}
            </div>
            {/* <div className="w-1/5 border-l"><RightBar /></div> */}
        </div>
    </div>
    )
}