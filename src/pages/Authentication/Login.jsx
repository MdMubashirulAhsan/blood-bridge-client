import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { Helmet } from 'react-helmet';
// import SocialLogin from '../SocialLogin/SocialLogin';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);

      const signInInfo = {
        email: data.email,
        lastSignInTime: result.user?.metadata?.lastSignInTime,
      };

      await axios.patch(`${import.meta.env.VITE_API_URL}/users`, signInInfo);

      Swal.fire({
        title: "Sign in Successful",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        title: "Login failed",
        text: error.message || error.code,
        icon: "error",
      });
    }
  };

  return (
    <>
    
    <Helmet>
            <title>Login | Blood Bridge</title>
        </Helmet>
    
    
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse justify-center">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-4xl font-bold text-primary text-center mb-6">Sign In</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="space-y-4">

                {/* Email */}
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="input input-bordered w-full"
                    placeholder="Email"
                  />
                  {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    {...register('password', { required: true, minLength: 6 })}
                    className="input input-bordered w-full"
                    placeholder="Password"
                  />
                  {errors.password?.type === 'required' && <p className="text-red-500 text-sm">Password is required</p>}
                  {errors.password?.type === 'minLength' && <p className="text-red-500 text-sm">Password must be 6 characters or longer</p>}
                </div>


                <button className="btn btn-primary w-full mt-4">Sign In</button>
              </fieldset>

              <p className="text-sm text-center mt-4">
                Don’t have an account?{" "}
                <Link className="text-accent font-semibold hover:underline" to="/register">Register</Link>
              </p>
            </form>

            {/* <SocialLogin /> */}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
