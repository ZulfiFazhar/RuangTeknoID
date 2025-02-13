/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  Label,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, ArrowBigUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AuthContext } from "@/components/auth/auth-context";
import LoginFirst from "@/components/auth/login-first";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
};

export default function ProfileDashboard() {
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const [data, setData] = useState({
    viewsData: [],
    topPosts: [],
    engagements: [],
  });
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // redirect to home
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for top posts
        const responseTopPosts = await api.get("/user/dashboard/top-posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const topPosts = responseTopPosts.data.data.map((item) => ({
          metric: item.metric,
          postId: item.postId,
          userId: item.userId,
          title: item.title,
          image_cover: item.image_cover,
          views: item.views,
          votes: item.votes,
          metric_value: item.metric_value,
        }));

        // Fetch data for engagements
        const responseEngagements = await api.get(
          "/user/dashboard/engagements",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const engagements = responseEngagements.data.data.map((item) => ({
          activity_date: new Date(item.activity_date).toLocaleDateString(),
          "Total Posts": item.posts_count,
          "Total Views": item.total_views,
          "Total Votes": item.total_votes,
          "Total Comments": item.comments_count,
        }));

        // Set data using a single useState
        setData({ topPosts, engagements });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto mt-4 w-4/5">
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      <Card className="p-4 mb-6">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={authStatus.user.profile_image_url}
              alt="@shadcn"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{authStatus.user.name}</h2>
            <p className="text-gray-500">Software Engineer</p>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.topPosts.slice(0, 3).map((post, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg flex flex-col h-full"
            onClick={() => navigate(`/posts/${post.postId}`)}
          >
            <CardHeader>
              <CardTitle>{post.metric}</CardTitle>
              <CardDescription className="truncate">
                {post.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <img
                src={post.image_cover}
                alt={post.title}
                className="rounded-xl object-cover w-full h-48"
              />
            </CardContent>
            <CardFooter className="mt-auto flex justify-between items-center">
              <div className="flex items-center gap-2 hover:bg-blue-100 p-2 rounded-lg hover:text-blue-600">
                <Eye />
                {post.views}
              </div>
              <div className="flex items-center gap-2 hover:bg-emerald-100 p-2 rounded-lg hover:text-emerald-600">
                <ArrowBigUp />
                {post.votes}
              </div>
            </CardFooter>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>My Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                data={data.engagements}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="activity_date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <Tooltip />
                <Line
                  dataKey="Total Posts"
                  type="linear"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="Total Views"
                  type="linear"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="Total Votes"
                  type="linear"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="Total Comments"
                  type="linear"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
