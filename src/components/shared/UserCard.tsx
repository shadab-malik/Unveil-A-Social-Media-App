import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { checkIsFollowed } from "@/lib/utils";

type UserCardProps = {
  user: Models.Document;
};


const UserCard = ({ user: currentUser }: UserCardProps) => {
  const { user } = useUserContext();

  
  return (
    <Link to={`/profile/${currentUser.$id}`} className="user-card">
      <img
        src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {currentUser.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{currentUser.username}
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        className={`${
          checkIsFollowed(user.followed, currentUser.$id)
            ? "!bg-dark-4 "
            : "shad-button_primary"
        } px-8`}
      >
        {checkIsFollowed(user.followed, currentUser.$id)
          ? "Following"
          : "Follow"}
      </Button>
    </Link>
  );
};

export default UserCard;
