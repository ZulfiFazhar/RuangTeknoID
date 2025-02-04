import {
  Home,
  Pen,
  // Newspaper,
  Sparkles,
  Bookmark,
  // User,
  // ScrollText,
  Search,
  CircleFadingPlus,
  MessageSquareDiff,
  UtilityPole,
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
  AskQuestion: {
    title: "Ask Question",
    url: "/discussions/new",
    icon: MessageSquareDiff,
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
        // Link profile setting sementara
        // {
        //   title: "Update Profile",
        //   url: "/users/update-profile",
        //   icon: User,
        // },
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
    title: "User",
    frontUrl: "users",
  },
  {
    title: "Diskusi",
    frontUrl: "discussions",
  },
];

export const otherUrl = [
  {
    title: "User Profile",
    url: "/users/profile"
  },
  {
    title: "User Settings",
    url: "/users/settings"
  },
  {
    title: "User Dashboard",
    url: "/users/dashboard"
  }
]
