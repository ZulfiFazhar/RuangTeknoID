import { useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function CoverImagePopover() {
  const [currentPage, setCurrentPage] = useState("embededLink");

  const handlePageChange = (page) => {
    if (currentPage !== page) setCurrentPage(page);
  };

  const skeletonItems = useMemo(
    () =>
      [...Array(12)].map((_, index) => (
        <div key={index} className="grid gap-2">
          <Skeleton className="h-28 w-48 rounded-xl" />
          <Skeleton className="h-3 w-48 rounded-xl" />
        </div>
      )),
    []
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="w-fit border-input p-0"
          aria-label="Add Cover Image"
        >
          Add Cover Image
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-96 w-max">
        <div className="flex gap-4">
          <Button
            variant="link"
            className={`p-0 ${
              currentPage === "embededLink" ? "underline font-bold" : ""
            }`}
            onClick={() => handlePageChange("embededLink")}
          >
            Embeded Link
          </Button>
          <Button
            variant="link"
            className={`p-0 ${
              currentPage === "unsplash" ? "underline font-bold" : ""
            }`}
            onClick={() => handlePageChange("unsplash")}
          >
            Unsplash
          </Button>
        </div>
        <Separator />
        <div className="mt-4">
          {currentPage === "embededLink" && (
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Masukkan url gambar..."
                aria-label="Embed Image URL"
              />
              <Button>Embed Image</Button>
            </div>
          )}
          {currentPage === "unsplash" && (
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Cari gambar..."
                aria-label="Search Unsplash Images"
              />
              <div className="grid grid-cols-3 gap-3 max-h-[432px] pr-2 overflow-y-auto">
                {skeletonItems}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CoverImagePopover;
