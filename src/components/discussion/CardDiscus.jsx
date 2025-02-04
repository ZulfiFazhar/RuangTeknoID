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
import MarkdownComponent from "@/components/ui/markdown-component";

export default function CardDiscus({ question }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/discussions/${question.discussionId}`);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  let hashtags = [];
  if(question.hashtags_name){
    hashtags = question.hashtags_name.split(",");
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-lg border-none border-0 shadow-none"
      key={question.discussionId}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={question.profile_image_url} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{question.author_name}</CardTitle>
          <CardDescription>{formatDate(question.createdAt)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <MarkdownComponent
          content={question.title}
          className="text-2xl font-bold"
        />
        <MarkdownComponent content={truncateText(question.content, 200)} />
        <div className="flex flex-row flex-wrap gap-1">
          {
            hashtags.map((hashtag, index) => (
              <Badge key={index} variant="outline">
                #{hashtag}
              </Badge>
            ))
          }

        </div>
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <div className="flex justify-between items-center w-full">
            {/* Votes */}
            <div className="border-2 border-secondary rounded-lg flex text-neutral-600">
              <Tooltip>
                <TooltipTrigger>
                  <button className={`m-0 p-2 rounded-l-lg flex gap-1 hover:bg-emerald-100 hover:text-emerald-600 ${` ${question.userVote == 1 ? "bg-emerald-100 text-emerald-600" : ""}`}`}>
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
                  <button className={`m-0 p-2 rounded-r-l  hover:bg-rose-100 hover:text-rose-600 rounded-r-lg border-l-2 border-secondary ${` ${question.userVote == -1 ? "bg-rose-100 text-rose-600" : ""}`}`}>
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
                    <span className="font-bold ml-0">{question.answer_count}</span>
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
