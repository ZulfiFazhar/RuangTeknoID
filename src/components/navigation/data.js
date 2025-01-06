import {
  Home,
  Newspaper,
  Sparkles,
  Bookmark,
  ScrollText,
  Search,
  CircleFadingPlus,
} from "lucide-react";

export const data = {
  NavSearch: {
    title: "Search",
    icon: Search,
  },
  NewPost: {
    title: "New Post",
    url: "/new-post",
    icon: CircleFadingPlus,
  },
  navAction: [
    {
      title: "Action Menu",
      items: [
        {
          title: "Beranda",
          url: "/",
          icon: Home,
        },
        {
          title: "Penanda",
          url: "/bookmark",
          icon: Bookmark,
        },
        {
          title: "Asisten AI",
          url: "/chatbot",
          icon: Sparkles,
        },
      ],
    },
  ],
  navMain: [
    {
      title: "Komunitas",
      items: [
        {
          title: "Threads",
          url: "/threads",
          icon: Newspaper,
        },
        {
          title: "Posts",
          url: "/posts",
          icon: ScrollText,
        },
      ],
    },
  ],
};
