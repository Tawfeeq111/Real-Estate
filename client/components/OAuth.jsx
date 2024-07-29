import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from "../src/firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../src/redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handelGoogleClick = async () => {
        try {
            console.log("Hello");
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const res = await fetch("/api/auth/google", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
              });
              const data = await res.json();
              dispatch(signInSuccess(data));
              navigate("/");
        } catch (error) {
            console.log("could not sign in with google", error.message);
        }
    } 

    return (
        <div className="flex flex-col gap-4">
            <button type="button" onClick={handelGoogleClick} className='btn_google max-w-full bg-red-700 text-white rounded-lg p-3 hover:opacity-80'>CONTINUE WITH GOOGLE</button>
        </div>
    );
}

export default OAuth;