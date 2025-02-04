import FeedDiscussions from "@/pages/Discussions/FeedDiscussions";

export default function Discussions() {
  return (
    <div className="grid m-auto">
      <h1 className="text-2xl font-bold mb-4">Forum Diskusi</h1>
      <div>
        <FeedDiscussions />
      </div>
    </div>
  );
}
