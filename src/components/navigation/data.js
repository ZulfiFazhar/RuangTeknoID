import {
  Home,
  Pen,
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
    url: "/search",
    icon: Search,
  },
  NewPost: {
    title: "New Post",
    url: "/posts/new",
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
          title: "Diskusi",
          url: "/discussions",
          icon: Pen,
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
  // navMain: [
  //   {
  //     title: "Komunitas",
  //     items: [
  //       {
  //         title: "Threads",
  //         url: "/threads",
  //         icon: Newspaper,
  //       },
  //       {
  //         title: "Posts",
  //         url: "/posts",
  //         icon: ScrollText,
  //       },
  //     ],
  //   },
  // ],
};

export const idBehindUrl = [
  {
    title: "Post",
    frontUrl: "posts",
  },
  {
    title: "New Post",
    frontUrl: "posts/new",
  },
  {
    title: "Edit Post",
    frontUrl: "posts/edit",
  },
  {
    title : "User",
    frontUrl: "users"
  }
]
