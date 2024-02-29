import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { LikedPosts } from "@/pages/private";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetUserById,
  useUpdateFollowers,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import GridPostList from "@/components/shared/GridPostList";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FollowList from "@/components/shared/FollowList";
import { checkIsFollowed } from "@/lib/utils";

interface StabBlockProps {
  value: string | number;
  label: string;
  list: string[];
}

const StatBlock = ({ value, label, list }: StabBlockProps) => (
  <Dialog>
    <DialogTrigger>
      <div className="flex-center gap-2">
        <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
        <p className="small-medium lg:base-medium text-light-2">{label}</p>
      </div>
    </DialogTrigger>
    <DialogContent className="bg-dark-2">
      <DialogHeader>
        <DialogTitle>{label}</DialogTitle>
      </DialogHeader>
      <div>
        {list.length === 0 ? (
          `No ${label}`
        ) : (
          <ul className="flex-row w-full">
            {list?.map((data) => (
              <li key={data} className="flex-row min-w-[200px] w-full p-4">
                <FollowList followerData={data} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const { data: currentUser } = useGetUserById(id || "");

  const { mutateAsync: updateFollowers, isPending: isUpdatingFollowers } =
    useUpdateFollowers();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const followingHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    let followers = [...currentUser.followers];
    let followed = [...user.followed];
    if (checkIsFollowed(currentUser.followers, user.id)) {
      followers = followers.filter((data) => JSON.parse(data).id != user.id);
      followed = followed.filter(
        (data) => JSON.parse(data).id != currentUser.$id
      );
    } else {
      followers.push(
        `{"id": "${user.id}", "name": "${user.name}", "username": "${user.username}", "imgUrl" : "${user.imageUrl}"}`
      );
      followed.push(
        `{"id": "${currentUser.$id}", "name": "${currentUser.name}", "username": "${currentUser.username}", "imgUrl" : "${currentUser.imageUrl}"}`
      );
    }
    updateFollowers({
      userId: user.id,
      followed,
      followedUserId: currentUser.$id,
      followers,
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <div className="flex-center gap-2 cursor-pointer">
                <p className="small-semibold lg:body-bold text-primary-500">
                  {currentUser.posts.length}
                </p>
                <p className="small-medium lg:base-medium text-light-2">
                  Posts
                </p>
              </div>
              <StatBlock
                value={currentUser.followers.length || 0}
                label="Followers"
                list={currentUser.followers}
              />
              <StatBlock
                value={currentUser.followed.length || 0}
                label="Following"
                list={currentUser.followed}
              />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <Button
                type="button"
                className={`${
                  checkIsFollowed(currentUser.followers, user.id)
                    ? "!bg-dark-4 "
                    : "shad-button_primary"
                } px-8`}
                onClick={(e) => followingHandler(e)}
              >
                {isUpdatingFollowers ? (
                  <Loader />
                ) : checkIsFollowed(currentUser.followers, user.id) ? (
                  "Following"
                ) : (
                  "Follow"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-5xl w-full">
        <Link
          to={`/profile/${id}`}
          className={`profile-tab rounded-l-lg ${
            pathname === `/profile/${id}` && "!bg-dark-3"
          }`}
        >
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </Link>
        {currentUser.$id === user.id && (
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        )}
      </div>

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
