export default function LoadingPage() {
  return (
    <div className="flex flex-col gap-10 items-center justify-center h-[80vh]">
      <div className="custom-loader"></div>
      <span className="text-xl">Memuat..</span>
    </div>
  );
}
