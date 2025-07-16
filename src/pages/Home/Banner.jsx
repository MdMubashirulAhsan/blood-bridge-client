import React from 'react';
import { Link } from 'react-router';
import bannerImg from "../../assets/banner/Man-being-prepped-to-donate.jpg"

const Banner = () => {
    return (
       <div
  className="hero h-[80vh] "
  style={{
    backgroundImage:
      `url(${bannerImg})`,
  }}
>
  <div className="hero-overlay"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold ">
  Donate Blood, Save Lives
</h1>
<p className="mb-5 ">
  Every drop counts. Join our mission to bring hope, healing, and life to those in urgent need. 
  Your generosity can make the difference between life and death.
</p>

      <div className='flex gap-3 justify-center'>
        <Link to="/register"><button className="btn btn-primary">Join as Donor</button></Link>
<Link to="/donor-search">      <button className="btn btn-primary">Search Donor</button>
</Link>
      </div>
    </div>
  </div>
</div>
    );
};

export default Banner;