import { db } from "@/firebase";
import {
  openCommentModal,
  openLoginModal,
  setCommentTweet,
} from "@/redux/modalSlice";
import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  TrashIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon as FilledH } from "@heroicons/react/solid";

export default function Tweet({ data, id }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

  async function likeComment(event) {
    event.stopPropagation();

    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }

    if (likes.includes(user.uid)) {
      await updateDoc(doc(db, "posts", id), {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(doc(db, "posts", id), {
        likes: arrayUnion(user.uid),
      });
    }
  }

  async function handleComment(event) {
    event.stopPropagation();

    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }

    dispatch(
      setCommentTweet({
        id: id,
        tweet: data?.tweet,
        photoUrl: data?.photoUrl,
        name: data?.name,
        username: data?.username,
      })
    );
    dispatch(openCommentModal());
  }

  async function deleteTweet(event) {
    event.stopPropagation();
    await deleteDoc(doc(db, "posts", id));
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "posts", id), (doc) => {
      setLikes(doc.data()?.likes);
      setComments(doc.data()?.comments);
    });

    return unsubscribe;
  }, []);

  return (
    <div
      className="border-b border-gray-700 cursor-pointer"
      onClick={() => router.push("/" + id)}
    >
      <TweetHeader
        name={data?.name}
        username={data?.username}
        timestamp={data?.timestamp?.toDate()}
        text={data?.tweet}
        photoUrl={data?.photoUrl}
        image={data?.image}
      />
      <div className="ml-16 p-3 text-gray-500 flex space-x-14 cursor-pointer">
        <div
          className="flex justify-center items-center space-x-2"
          onClick={handleComment}
        >
          <ChatIcon className="w-5 cursor-pointer hover:text-green-400" />
          {comments?.length > 0 && <span>{comments?.length}</span>}
        </div>
        <div
          className="flex justify-center items-center space-x-2"
          onClick={likeComment}
        >
          {likes.includes(user.uid) ? (
            <FilledH className="w-5 text-pink-500" />
          ) : (
            <HeartIcon className="w-5 cursor-pointer hover:text-pink-400" />
          )}
          {likes.length > 0 && <span>{likes.length}</span>}
        </div>
        {user.uid === data?.uid && (
          <div
            onClick={deleteTweet}
            className="cursor-pointer hover:text-red-600"
          >
            <TrashIcon className="w-5" />
          </div>
        )}
        <ChartBarIcon className="w-5 cursor-not-allowed" />
        <UploadIcon className="w-5 cursor-not-allowed" />
      </div>
    </div>
  );
}

export function TweetHeader({
  username,
  name,
  timestamp,
  text,
  photoUrl,
  image,
}) {
  return (
    <div className="flex space-x-3 p-3">
      <img className="w-11 h-11 rounded-full object-cover" src={photoUrl} />
      <div>
        <div className=" text-gray-500 flex space-x-2 items-center mb-1">
          <h1 className="text-white font-bold">{name}</h1>
          <span>@{username}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <Moment fromNow>{timestamp}</Moment>
        </div>
        <span>{text}</span>
        {image && (
          <img
            className="object-cover rounded-md mt-3 max-h-80 border border-gray-700"
            src={image}
          />
        )}
      </div>
    </div>
  );
}
