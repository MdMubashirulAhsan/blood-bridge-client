import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import districts from "../../assets/districts.json";
import upazilaData from "../../assets/upazilas.json";
import { Helmet } from 'react-helmet';

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const selectedDistrict = watch("district");
  const upazilas = selectedDistrict ? upazilaData[selectedDistrict] || [] : [];

  const onSubmit = (data) => {
    if (data.password !== data.confirm_password) {
      return Swal.fire("Error", "Passwords do not match!", "error");
    }

    createUser(data.email, data.password)
      .then(async () => {
        const userInfo = {
          email: data.email,
          role: "donor",
          status: "active",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
          name: data.name,
          avatar: profilePic,
          blood_group: data.blood_group,
          district: data.district,
          upazila: data.upazila,
        };

        try {
          await axiosInstance.post("/users", userInfo);

          const userProfile = {
            displayName: data.name,
            photoURL: profilePic,
          };

          await updateUserProfile(userProfile);

          Swal.fire("Success!", "Account created successfully", "success").then(() =>
            navigate(from)
          );
        } catch (err) {
          console.error("Error saving user info:", err);
          Swal.fire("Error", "Failed to save user information", "error");
        }
      })
      .catch((err) => {
        console.error("Registration error:", err);
        Swal.fire("Error", err.message || "Registration failed", "error");
      });
  };

  const handleImageUpload = async (e) => {
  const image = e.target.files[0];
  const formData = new FormData();
  formData.append("file", image);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  formData.append("upload_preset", uploadPreset);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const res = await axios.post(cloudinaryUrl, formData);
    setProfilePic(res.data.secure_url);
  } catch (err) {
    console.error("Image upload failed:", err);
    Swal.fire("Upload Error", "Failed to upload image. Please try again.", "error");
  }
};


  return (
    <>
    <Helmet>
            <title>Register | Blood Bridge</title>
        </Helmet>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-4xl font-bold text-center">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset space-y-3">
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500">Name is required</p>}

            <label className="label">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
            />

            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">Password must be at least 6 characters</p>
            )}

            <label className="label">Confirm Password</label>
            <input
              type="password"
              {...register("confirm_password", { required: true })}
              className="input"
              placeholder="Confirm Password"
            />
            {errors.confirm_password && (
              <p className="text-red-500">Confirm Password is required</p>
            )}

            <label className="label">Blood Group</label>
            <select
              {...register("blood_group", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.blood_group && <p className="text-red-500">Blood group is required</p>}

            <label className="label">District</label>
            <select
              {...register("district", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.district && <p className="text-red-500">District is required</p>}

            <label className="label">Upazila</label>
            <select
              {...register("upazila", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Upazila</option>
              {upazilas.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {errors.upazila && <p className="text-red-500">Upazila is required</p>}

            <button className="btn btn-primary text-black mt-4 w-full">
              Register
            </button>
          </fieldset>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link className="link link-primary" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
