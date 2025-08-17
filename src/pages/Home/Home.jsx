import React from "react";
import NavBar from "../Shared/Navbar";
import Banner from "./Banner";
import Featured from "./Featured";
import ContactUs from "./ContactUs";
import HowItWorks from "./HowItWorks";
import TopDonors from "./TopDonors";
import { Helmet } from "react-helmet";
import BloodDonationSections from "../../components/BloodDonationSections"

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | Blood Bridge</title>
      </Helmet>
      <div className="space-y-20">
        <div className="-mx-[3vw]">
          <Banner></Banner>
        </div>
        <Featured></Featured>
        <HowItWorks></HowItWorks>

        <BloodDonationSections></BloodDonationSections>
        <TopDonors></TopDonors>
        
        <ContactUs></ContactUs>
      </div>
    </>
  );
};

export default Home;
