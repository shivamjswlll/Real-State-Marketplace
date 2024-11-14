import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import { signInStart, signInSuccess, signInFailure } from "../redux/User/userSlice";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const {error, loading} = useSelector(state => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   dispatch(signInStart());
   try {
     const res = await fetch("api/auth/signup", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(formData),
     });
     const data = await res.json();
     if(data.success == false) {
      dispatch(signInSuccess(data));
      return;
     }
     dispatch(signInFailure(data.message));
     navigate("/sign-in");
    //  console.log(data);
   } catch (error) {
    dispatch(signInFailure(error));
    // console.log(error);
    // console.log(JSON.stringify(formData));
   }
 };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "signUp"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
        {error ? (
          <p className="text-red-500 mt-5">{error}</p>
        ) : (
          ""
        )}
    </div>
  );
}
