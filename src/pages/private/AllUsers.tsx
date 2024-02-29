import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AllUsers = () => {
  const { toast } = useToast();
  const { user } = useUserContext();
  const { ref, inView } = useInView();
  const {
    data: creators,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError: isErrorCreators,
  } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return;
  }

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex gap-3">
          <img
            src="/assets/icons/people.svg"
            alt={"photo"}
            className={`group-hover:invert-white w-10`}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        </div>

        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.pages.map((page) =>
              page?.documents
                ?.filter((creator) => creator.$id != user.id)
                ?.map((creator) => (
                  <li
                    key={creator?.$id}
                    className="flex-1 min-w-[200px] w-full"
                  >
                    <UserCard  user={creator} />
                  </li>
                ))
            )}
          </ul>
        )}
      </div>
      {hasNextPage && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AllUsers;
