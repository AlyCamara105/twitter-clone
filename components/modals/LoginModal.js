import { auth } from "@/firebase";
import { closeLoginModal, openLoginModal } from "@/redux/modalSlice";
import Modal from "@mui/material/Modal";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LoginModal() {
  const isOpen = useSelector((state) => state.modals.loginModalOpen);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignIn() {
    await signInWithEmailAndPassword(auth, email, password);
  }

  function returnRandom10DigitNumber() {
    let numString = "";
    for (let i = 1; i < 11; i++) {
      numString += Math.ceil(Math.random() * 10);
    }
    return numString;
  }

  async function handleGuestSignIn() {
    const fakeEmail = `guest${returnRandom10DigitNumber()}@gmail.com`;
    const fakePassword = returnRandom10DigitNumber();
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      fakeEmail,
      fakePassword
    );

    await updateProfile(auth.currentUser, {
      displayName: `${fakeEmail.split("@")[0]}`,
      photoURL: `./assets/profilePictures/pfp${Math.ceil(
        Math.random() * 6
      )}.png`,
    });

    await signInWithEmailAndPassword(auth, fakeEmail, fakePassword);

    router.reload();
  }

  return (
    <>
      <button
        onClick={() => dispatch(openLoginModal())}
        className="bg-transparent border border-white text-white w-[160px] rounded-full h-[40px] hover:bg-[#cbd2d7]"
      >
        Log In
      </button>
      <Modal
        className="flex justify-center items-center"
        open={isOpen}
        onClose={() => dispatch(closeLoginModal())}
      >
        <div className="w-[90%] h-[600px] bg-black text-white md:w-[560px] md:h-[600px] border border-gray-700 rounded-lg flex justify-center">
          <div className="w-[90%] mt-8 flex flex-col">
            <h1 className="text-center mt-4 font-bold text-4xl">
              Sign in to your account
            </h1>
            <input
              placeholder="Email"
              className="h-10 mt-8 rounded-md bg-transparent border border-gray-700 p-6"
              type={"email"}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              placeholder="Password"
              className="h-10 mt-8 rounded-md bg-transparent border border-gray-700 p-6"
              type={"password"}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className="bg-white text-black w-full font-bold text-lg p-2 mt-8 rounded-md"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <h1 className="text-center mt-8 font-bold text-lg">or</h1>
            <button
              className="bg-white text-black w-full font-bold text-lg p-2 rounded-md mt-4"
              onClick={handleGuestSignIn}
            >
              Sign is as guest
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
