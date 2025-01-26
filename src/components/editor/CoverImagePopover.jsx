import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/api/api";

function CoverImagePopover({ onImageSelected }) {
  const [currentPage, setCurrentPage] = useState("embededLink");
  const [previewImage, setPreviewImage] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  // Fetch random images when switching to the "unsplash" tab
  useEffect(() => {
    const fetchRandomImages = async () => {
      if (
        currentPage === "unsplash" &&
        !Object.keys(hasFetched).length &&
        !searchQuery
      ) {
        try {
          setIsLoading(true);
          const response = await api.get("/unsplash/random-photos");
          if (response.data.status === "success") {
            setImages(response.data.data);
            setHasFetched({ random: response.data.data });
          }
        } catch (error) {
          console.error("Error fetching random images:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRandomImages();
  }, [currentPage, hasFetched, searchQuery]);

  const fetchSearchPhotos = async (page) => {
    try {
      setIsLoading(true);
      const response = await api.get("/unsplash/search-photos", {
        params: { query: searchQuery, page },
      });
      if (response.data.status === "success") {
        setHasFetched((prev) => ({ ...prev, [page]: response.data.data }));
        setImages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPageNumber(page);
    if (!hasFetched[page]) {
      fetchSearchPhotos(page);
    } else {
      setImages(hasFetched[page]);
    }
  };

  const handleSearchKeyDown = async (event) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      setIsSearching(true);
      setPageNumber(1);
      fetchSearchPhotos(1);
      setHasFetched({});
    }
  };

  const handlePreview = () => {
    if (previewImage.trim()) {
      setIsPreviewVisible(true);
    }
  };

  const handleImageClick = (imageUrl) => {
    console.log("Clicked image URL:", imageUrl);
    onImageSelected(imageUrl);
  };

  const handleEmbed = () => {
    console.log("Embeded image: ", previewImage);
    onImageSelected(previewImage);
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
            onClick={() => setCurrentPage("embededLink")}
          >
            Embeded Link
          </Button>
          <Button
            variant="link"
            className={`p-0 ${
              currentPage === "unsplash" ? "underline font-bold" : ""
            }`}
            onClick={() => setCurrentPage("unsplash")}
          >
            Unsplash
          </Button>
        </div>
        <Separator />
        <div className="mt-4">
          {currentPage === "embededLink" && (
            <div className="flex flex-col gap-4 w-[39rem] max-h-fit">
              <Input
                type="text"
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                placeholder="Masukkan URL gambar..."
                aria-label="Embed Image URL"
              />
              <Button variant="outline" onClick={handlePreview}>
                Preview
              </Button>
              <Button onClick={handleEmbed}>Embed Image</Button>
              {isPreviewVisible && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="rounded-xl object-cover h-72 w-full"
                />
              )}
            </div>
          )}
          {currentPage === "unsplash" && (
            <div className="flex flex-col gap-4 w-[39rem]">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Cari gambar..."
                aria-label="Search Unsplash Images"
              />
              <div className="grid grid-cols-3 gap-3 max-h-[22rem] pr-2 overflow-y-auto">
                {!isLoading && Array.isArray(images)
                  ? images.map((image) => (
                      <div key={image.id} className="grid gap-1">
                        <img
                          src={image.urls.thumb}
                          alt={image.alt_description}
                          className="object-cover h-28 w-48 rounded-xl cursor-pointer"
                          onClick={() => handleImageClick(image.urls.regular)}
                        />
                        <p className="h-3 w-48 mb-2 text-sm text-neutral-400">
                          by{" "}
                          <a
                            href={image.user_profile}
                            className="underline hover:text-blue-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {image.username}
                          </a>
                        </p>
                      </div>
                    ))
                  : skeletonItems}
              </div>
              {isSearching && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className="cursor-pointer"
                        onClick={() =>
                          handlePageChange(Math.max(pageNumber - 1, 1))
                        }
                      />
                    </PaginationItem>
                    {[1, 2, 3].map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          className="cursor-pointer"
                          isActive={page === pageNumber}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className="cursor-pointer"
                        onClick={() => handlePageChange(pageNumber + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
CoverImagePopover.propTypes = {
  onImageSelected: PropTypes.func,
};

export default CoverImagePopover;
