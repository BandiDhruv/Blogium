import  { useMemo, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Blog, Vote, useGetUser, useVote } from "../hooks";
import { AppBar } from "./AppBar";
import { Avatar } from "./BlogCard";
import { FaEdit } from "react-icons/fa";
import { EditModal } from "./EditModal";
import { setWithExpiry } from "../hooks/cache";
import parse from 'html-react-parser';
import { Badge } from "@mantine/core";
import { BiDownvote, BiUpvote } from "react-icons/bi";

export const BlogDetail = ({ blog, setBlog }: { blog: Blog,setBlog:Dispatch<SetStateAction<Blog | undefined>> }) => {
  const { user } = useGetUser();
  const [modalToggle, setModalToggle] = useState<boolean>(false);
  const title = useMemo(() => blog?.title || "", [blog?.title]);
  const content = useMemo(() => blog?.content || "", [blog?.content]);
  const date = useMemo(() => {
    return blog?.created_at?.toLocaleString().split('T')[0] || "2030-01-01";
  }, [blog?.created_at]);

  const Udate = useMemo(() => {
    return blog?.updated_at?.toLocaleString().split('T')[0] || "2030-01-01";
  }, [blog?.updated_at]);

  const { handleVote } = useVote(blog?.id, setBlog);

  const calculateVotes = (votes: Vote[] | undefined): { upvotes: number; downvotes: number } => {
    const defaultVotes = { upvotes: 0, downvotes: 0 };
  
    if (!votes) return defaultVotes;
  
    const upvotes = votes.filter(vote => vote.voteType === "UPVOTE").length;
    const downvotes = votes.filter(vote => vote.voteType === "DOWNVOTE").length;
  
    return { upvotes, downvotes };
  };
  
  const initialVotes = useMemo(() => calculateVotes(blog?.votes), [blog?.votes]);
  
  useEffect(() => {
    console.log(blog);
    setWithExpiry('lastVisitedblog', blog, 2 * 60 * 60 * 1000);
  }, [blog]);

  return (
    <div>
      <AppBar />
      <div className="flex justify-center h-[90vh]">
        <div className="grid grid-cols-12 px-10 py-8 w-full max-w-screen-xl h-[100%] overflow-y-auto">
          <div className="col-span-8 ">
            <div className="flex justify-between text-5xl font-extrabold">
              <div className="text-wrap">
                
                {parse(title)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-slate-500 pt-2">
                {`Posted On ${date} `}
                {blog?.created_at !== blog?.updated_at && <div className=" text-slate-500 ">{`Edited On ${Udate}`}</div>}
              </div>
              {user?.id === blog?.author?.id &&
                <div className="mr-6">
                  <FaEdit className="cursor-pointer hover:scale-110" onClick={() => { setModalToggle(!modalToggle) }} />
                </div>
              }
            </div>
            <div className="font-medium border-b border-dashed py-5 mt-2 border-t bodred-dashed max-w-[95%] overflow-x-auto ">
              {parse(content)}
            </div>
            {blog?.tags?.length > 0 && (
              <div className="flex flex-wrap">
                {blog?.tags.map((tag, index) => (
                  <Badge key={index} color="indigo" m={"xs"}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex mt-2 gap-3 items-center justify-start">
              <div className="">Reply</div>
              <div className="flex items-center">
                <BiUpvote cursor="pointer" onClick={() => handleVote("UPVOTE")} />
                <span>{initialVotes.upvotes}</span>
              </div>
              <div className="flex items-center">
                <BiDownvote cursor="pointer" onClick={() => handleVote("DOWNVOTE")} />
                <span>{initialVotes.downvotes}</span>
              </div>
            </div>
          </div>
          <div className="col-span-4 ">
            <div className="text-slate-400 font-bold text-lg">
              Author 
            </div>
            <div className="flex px-1 gap-3 pt-2 border-t-2">
              <div className="basis-1/6">
                <Avatar name={blog?.author?.name || "Anonymous"} ProfilePic={blog?.author?.ProfilePic} />
              </div>
              <div className="basis-5/6">
                <div className="text-xl font-bold">
                  {blog?.author?.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-400">
                  {blog?.author?.catchPhrase && blog?.author?.catchPhrase?.length > 50 ? blog?.author?.catchPhrase : "Random Catch Phrase Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum error labore quaerat, id optio aliquid expedita veritatis molestias consequatur. Ratione quis doloribus voluptas voluptates consectetur non hic velit, soluta libero."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalToggle &&
        <EditModal blog={blog} modal={modalToggle} setModal={setModalToggle} />
      }
    </div>
  );
};
