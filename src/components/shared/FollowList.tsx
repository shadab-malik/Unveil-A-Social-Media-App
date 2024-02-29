import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { checkIsFollowed } from "@/lib/utils";

type FollowListModelProps = {
  followerData: string;
};

const FollowListModel = ({ followerData }: FollowListModelProps) => {
  const { user } = useUserContext();
  const followerUser = JSON.parse(followerData);

  return (
    <div className="flex justify-between gap-3 ">
      <div>
        <Link to={`/profile/${followerUser.id}`} className="flex gap-2">
          <img
            src={
              followerUser?.imgUrl || "/assets/icons/profile-placeholder.svg"
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
            user.id === followerUser.id
              ? "hidden"
              : checkIsFollowed(user.followed, followerUser.id)
              ? "!bg-dark-4 "
              : "shad-button_primary"
          } px-5`}
        >
          {checkIsFollowed(user.followed, followerUser.id)
            ? "Following"
            : "Follow"}
        </Button>
      </div>
    </div>
  );
};

export default FollowListModel;
