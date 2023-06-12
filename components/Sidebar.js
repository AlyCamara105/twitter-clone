import { auth } from "@/firebase";
import { closeLoginModal, closeSignupModal } from "@/redux/modalSlice";
import { signOutUser } from "@/redux/userSlice";
import {
  HomeIcon,
  HashtagIcon,
  InboxIcon,
  BookmarkIcon,
  BellIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  async function handleSignOut() {
    await signOut(auth);
    dispatch(signOutUser());
    dispatch(closeSignupModal())
    dispatch(closeLoginModal())
  }

  return (
    <div className="h-full hidden sm:flex flex-col fixed xl:ml-24">
      <nav className="h-full xl:space-y-1.5 relative">
        <div className="xl:p-3 py-3 flex justify-center items-center xl:justify-start">
          <Image src={"/assets/twitter-logo.png"} width={34} height={34} />
        </div>
        <SidebarLink text={"Home"} Icon={HomeIcon} />
        <SidebarLink text={"Explore"} Icon={HashtagIcon} />
        <SidebarLink text={"Notifications"} Icon={BellIcon} />
        <SidebarLink text={"Messages"} Icon={InboxIcon} />
        <SidebarLink text={"Bookmarks"} Icon={BookmarkIcon} />
        <SidebarLink text={"Profile"} Icon={UserIcon} />
        <SidebarLink text={"More"} Icon={DotsCircleHorizontalIcon} />
        <button className="hidden xl:inline bg-[#1d9bf0] rounded-full h-[53px] w-[200px] mt-2 text-lg font-bold">
          Tweet
        </button>
        <div
          className="absolute bottom-0 flex justify-center items-center xl:p-3 space-x-3 hover:bg-white hover:bg-opacity-10 rounded-full cursor-pointer"
          onClick={handleSignOut}
        >
          <img
            src={user.photoUrl || "/assets/kylie.png"}
            className="w-10 h-10 rounded-full object-cover"
            alt=""
          />
          <div className="hidden xl:inline">
            <h1 className="font-bold whitespace-nowrap">{user.name}</h1>
            <h1 className="text-gray-500">{user.username}</h1>
          </div>
          <DotsHorizontalIcon className="h-5 hidden xl:inline" />
        </div>
      </nav>
    </div>
  );
}

function SidebarLink({ text, Icon }) {
  return (
    <li className="hoverAnimation flex mb-3 xl:justify-start justify-center items-center text-xl space-x-3">
      <Icon className="h-7" />
      <span className="hidden xl:flex">{text}</span>
    </li>
  );
}
