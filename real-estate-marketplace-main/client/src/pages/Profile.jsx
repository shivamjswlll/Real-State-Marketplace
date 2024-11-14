import React from 'react';
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { deleteUserStart, deleteUserFailure, deleteUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/User/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({}); 
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState('');
  const [listingsData, setListingsData] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {currentUser, loading, error} = useSelector(state => state.user);
  useEffect(() => {
    if(file) {
      setFileUploadError(false);
      handleFileUpload(file);
    }
  }, [file]);

 const handleFileUpload = (file) => {
   const storage = getStorage(app);
   const fileName = new Date().getTime() + file.name;
   const storageRef = ref(storage, fileName);
   const uploadTask = uploadBytesResumable(storageRef, file);

   uploadTask.on(
     "state_changed",
     (snapshot) => {
       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       setFilePerc(Math.round(progress));
     },
     (error) => {
       setFileUploadError(true);
      //  console.log(error);

     },
     () => {
       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
         setFormData({ ...formData, photo: downloadURL })
       );
     }
   );
 };
//  console.log(formData);
 const handleChange = (e) => {
  setFormData({...formData, [e.target.id] : e.target.value});
 }

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart());
    const res = await fetch( `/api/user/update/${currentUser._id}`, {
      method : "POST",
      headers : {
        "content-type" : "application/json",
      },
      body : JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false) {
      console.log(data); 

      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  } catch (error) {
    dispatch(updateUserFailure(error));
  }
 }

 const handleDelete = async (e) => {
  dispatch(deleteUserStart());
  try {
    const res = await fetch(`api/user/delete/${currentUser._id}`, {
      method : "DELETE",
    });


    const data = await res.json();
    console.log(data);
    if(data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess());
    navigate('/sign-in');
  } catch (error) {
    dispatch(deleteUserFailure(error));
  }
 } 

 const handleSignOut = async (e) => {
  dispatch(deleteUserStart());
  try {
    const res = await fetch(`api/user/signout/${currentUser._id}`, {
      method: "POST",
    });

    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess());
    navigate("/sign-in");
  } catch (error) {
    dispatch(deleteUserFailure(error));
  }
 }

 const handleShowListing = async () => {
  try {
    const res = await fetch(`api/user/listings/${currentUser._id}`, {
      method:"GET",
    })

    const data = await res.json();
    if(data.success == false) {
      setShowListingsError(data.message);
      return;
    }
    setListingsData(data);
  } catch (error) {
    setShowListingsError(error.message);
  }
 }

 const handleListingDelete = async (listingId) => {
  try {
    const res = await fetch(`api/listing/delete/${listingId}`, {
      method : "DELETE",
    });

    const data = await res.json();
    if(data.success == false) {
      console.log(data.message);
      return;
    }
    setListingsData((prev) => 
      prev.filter((listing) => listing._id != listingId)
    );
  } catch (error) {
    console.log(error.message);
  }
 }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.photo}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          id="userid"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.userid}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "uploading..." : "update"}
        </button>
        <Link
          className="text-white bg-green-700 p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      <div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
        {updateSuccess && (
          <p className="text-green-500 mt-5">
            User details updated successfully
          </p>
        )}
      </div>
      <button
        type='button'
        onClick={handleShowListing}
        className="text-green-700 w-full mt-3"
      >
        Show listings
      </button>
      <p>{showListingsError ? showListingsError : '' }</p>
      {listingsData && listingsData.length > 0 &&
         <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {listingsData.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
              <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
          </div>
      }
    </div>
  );
}
