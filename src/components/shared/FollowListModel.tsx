import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { checkIsFollowed } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

type FollowListModelProps = {
  value: string | number;
  label: string;
  list: string[];
};

const FollowListModel = ({ value, label, list }: FollowListModelProps) => {
  const { user } = useUserContext();
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex-center gap-2">
          <p className="small-semibold lg:body-bold text-primary-500">
            {value}
          </p>
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
                <li
                  key={JSON.parse(data).id}
                  className="flex-row min-w-[200px] w-full p-4"
                >
                  <div className="flex justify-between gap-3 ">
                    <Link
                      to={`/profile/${JSON.parse(data).id}`}
                      className="flex gap-2"
                    >
                      <DialogClose>
                        <div className="flex gap-4">
                          <img
                            src={
                              JSON.parse(data)?.imgUrl ||
                              "/assets/icons/profile-placeholder.svg"
                            }
                            alt="creator"
                            className="rounded-full w-14 h-14"
                          />
                          <div className="flex flex-col items-start gap-1 pt-1  min-w-full">
                            <p className="base-medium text-light-1  line-clamp-1">
                              {JSON.parse(data)?.name}
                            </p>
                            <p className="small-regular text-light-3 line-clamp-1">
                              @{JSON.parse(data)?.username}
                            </p>
                          </div>
                        </div>
                      </DialogClose>
                    </Link>
                    <div className="flex-center">
                      <Button
                        type="button"
                        size="sm"
                        className={`${
                          user.id === JSON.parse(data).id
                            ? "hidden"
                            : checkIsFollowed(
                                user.followed,
                                JSON.parse(data).id
                              )
                            ? "!bg-dark-4 "
                            : "shad-button_primary"
                        } px-5`}
                      >
                        {checkIsFollowed(user.followed, JSON.parse(data).id)
                          ? "Following"
                          : "Follow"}
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowListModel;
