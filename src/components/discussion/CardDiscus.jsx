/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowBigUp,
  ArrowBigDown,
  Bookmark,
  Share,
  MessageCircleMore,
} from "lucide-react";
import formatDate from "@/lib/formatDate";

export default function CardDiscus({ question }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/discussions/${question.discussionId}`);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg border-none border-0 shadow-none"
      key={question.discussionId}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>Author</CardTitle>
          <CardDescription>{formatDate(question.createdAt)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{question.title}</h1>
        <p>{question.content}</p>
        <div className="flex flex-row flex-wrap gap-1">
          <Badge variant="outline">#python</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <div className="flex justify-between items-center w-full">
            {/* Votes */}
            <div className="border-2 border-secondary rounded-lg flex text-neutral-600">
              <Tooltip>
                <TooltipTrigger>
                  <button className="m-0 p-2 rounded-l-lg flex gap-1 hover:bg-emerald-100 hover:text-emerald-600">
                    <ArrowBigUp />{" "}
                    <span className="pr-1 font-bold ml-0">
                      {question.votes}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Upvote</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <button className="m-0 p-2 rounded-r-l  hover:bg-rose-100 hover:text-rose-600 rounded-r-lg border-l-2 border-secondary">
                    <ArrowBigDown />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Downvote</TooltipContent>
              </Tooltip>
            </div>

            {/* Action */}
            <div className="flex gap-1 text-neutral-600">
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className="cursor-pointer flex gap-1 items-center hover:text-amber-600 hover:bg-amber-100 p-2 rounded-lg"
                    // onClick={handleButtonClick}
                  >
                    <MessageCircleMore size={20} />{" "}
                    <span className="font-bold ml-0">4</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Replies</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <button className="cursor-pointer hover:text-fuchsia-600 hover:bg-fuchsia-100 p-2 rounded-lg">
                    <Bookmark />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Bookmark</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <button className="cursor-pointer hover:text-blue-600 hover:bg-blue-100 p-2 rounded-lg">
                    <Share size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

CardDiscus.propTypes = {
  question: PropTypes.shape({
    discussionId: PropTypes.number,
    // title: PropTypes.string,
    // content: PropTypes.string,
    // views: PropTypes.number,
    // votes: PropTypes.number,
    // userVote: PropTypes.number,
  }),
};
