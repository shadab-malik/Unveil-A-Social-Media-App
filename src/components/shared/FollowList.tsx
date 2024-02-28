// import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";

type FollowListModelProps = {
  followerId: string;
};

const checkIsFollowed = (followed: string[], userId: string) => {
  return followed.includes(userId);
};

const FollowListModel = ({ followerId }: FollowListModelProps) => {
  const { user } = useUserContext();
  const { data: followerUser } = useGetUserById(followerId || "");

  return (
    <div className="flex justify-between gap-3 ">
      <div>
        <Link to={`/profile/${followerId}`} className="flex gap-2">
          <img
            src={
              followerUser?.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="creator"
            className="rounded-full w-14 h-14"
          />

          <div className="flex flex-col gap-1 pt-1">
            <p className="base-medium text-light-1 text-center line-clamp-1">
              {followerUser?.name}
            </p>
            <p className="small-regular text-light-3 line-clamp-1">
              @{followerUser?.username}
            </p>
          </div>
        </Link>
      </div>
      <div className="flex-center">
        <Button
          type="button"
          size="sm"
          className={`${
            user.id === followerId
              ? "hidden"
              : checkIsFollowed(user.followed, followerId)
              ? "!bg-dark-4 "
              : "shad-button_primary"
          } px-5`}
        >
          {checkIsFollowed(user.followed, followerId) ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
};

export default FollowListModel;
