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
import Posts from "../../pages/Posts/Posts";

export default function CardPost({ post, bookmarkPost, handleVote }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${post.postId}`);
  };

  const handleVoteClick = (event, type) => {
    event.stopPropagation();
    handleVote(post.postId, type, post.userVote);
  };

  const handleBookmarkClick = (event) => {
    event.stopPropagation();
    bookmarkPost(post.postId);    
  };

  const handleUpVoteClick = (event) => {
    event.stopPropagation();
    handleVote(post.postId, "up", post.userVote);
  };
  const handleDownVoteClick = (event) => {
    event.stopPropagation();
    handleVote(post.postId, "down", post.userVote);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg"
      key={post.postId}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{post.author}</CardTitle>
          <CardDescription>{post.createdAt}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <img
          src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="content-image"
          className="rounded-xl"
        />
        <p>{post.title}</p>
        <div className="flex flex-row flex-wrap gap-1">
          {
            post.hashtags?.split(',').map((hashtag, index) => (
              <Badge key={index} className="w-fit cursor-pointer" variant="outline">
                #{hashtag}
              </Badge>
            ))
          }
          {/* <Badge className="w-fit cursor-pointer" variant="outline">
            #python
          </Badge>
          <Badge className="w-fit cursor-pointer" variant="outline">
            #coding
          </Badge>
          <Badge className="w-fit cursor-pointer" variant="outline">
            #machine-learning
          </Badge> */}
        </div>
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <div className="flex justify-between items-center w-full">
            {/* Votes */}
            <div className="border-2 border-secondary rounded-lg flex text-neutral-600">
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className={`${post.userVote == 1 ? 'bg-emerald-100 text-emerald-600' : ''} m-0 p-2 rounded-l-lg flex gap-1 hover:bg-emerald-100 hover:text-emerald-600`}
                    onClick={e => handleVoteClick(e, "up")}
                  >
                    <ArrowBigUp />{" "}
                    <span className="pr-1 font-bold ml-0">
                      {post.votes}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Upvote</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className={`${post.userVote == -1 ? 'bg-rose-100 text-rose-600' : ''} m-0 p-2 rounded-r-l  hover:bg-rose-100 hover:text-rose-600 rounded-r-lg border-l-2 border-secondary`}
                    onClick={e => handleVoteClick(e, "down")}
                  >
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
                    <span className="font-bold ml-0">
                      {post.commentsCount}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Comment</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className="cursor-pointer hover:text-fuchsia-600 hover:bg-fuchsia-100 p-2 rounded-lg"
                    onClick={handleBookmarkClick}
                  >
                    <Bookmark
                      size={20}
                      className={post.isBookmarked == 1 ? "fill-current" : ""}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Bookmark</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <button
                    className="cursor-pointer hover:text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                    // onClick={handleButtonClick}
                  >
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

CardPost.propTypes = {
  post: PropTypes.shape({
    postId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  bookmarkPost: PropTypes.func.isRequired,
};
