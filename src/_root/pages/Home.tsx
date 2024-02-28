import { Models } from "appwrite";

import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const { toast } = useToast();
  const { ref, inView } = useInView();
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useGetPosts();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (isError) {
    toast({
      title: "Something bad happened :/",
    });
    return;
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.pages.map((page) =>
                page?.documents.map((post: Models.Document) => (
                  <li key={post.$id} className="flex justify-center w-full">
                    <PostCard post={post} key={post.caption} />
                  </li>
                ))
              )}
            </ul>
          )}
          {hasNextPage && (
            <div ref={ref} className="mt-10">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
