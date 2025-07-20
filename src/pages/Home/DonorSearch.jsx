import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure from '../../hooks/useAxiosSecure';
import districts from '../../assets/districts.json';
import upazilasByDistrict from '../../assets/upazilas.json';
import useAxios from '../../hooks/useAxios';
import { Helmet } from 'react-helmet';

const blood_group = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorSearch = () => {
  const axios = useAxios();

  const [form, setForm] = useState({
    blood_group: '',
    district: '',
    upazila: ''
  });

  const [query, setQuery] = useState(null);

  const { data: donors = [], isLoading } = useQuery({
    queryKey: ['searchDonors', query],
    queryFn: async () => {
      // Remove empty values from query before sending
      const filteredQuery = {};
      Object.entries(query).forEach(([key, value]) => {
        if (value.trim() !== '') filteredQuery[key] = value.trim();
      });

      const params = new URLSearchParams(filteredQuery).toString();
      // console.log('📦 Sent query params:', params);

      const res = await axios.get(`/donors?${params}`);
      // console.log('📥 Received donors:', res.data);

      return res.data;
    },
    enabled: !!query
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(form); // Trigger query on submit
  };

  return (
    <>
    
    <Helmet>
            <title>Search Donor | Blood Bridge</title>
        </Helmet>
    
    <div className=" mx-auto  py-10">
      <h1 className="text-3xl font-bold mb-6">Search Donors</h1>

      <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-3 mb-8">
        <select
          name="blood_group"
          value={form.blood_group}
          onChange={handleChange}
          className="select select-bordered"
          required
        >
          <option value="" disabled>Select Blood Group</option>
          {blood_group.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <select
          name="district"
          value={form.district}
          onChange={handleChange}
          className="select select-bordered"
          required
        >
          <option value="" disabled>Select District</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          name="upazila"
          value={form.upazila}
          onChange={handleChange}
          className="select select-bordered"
          required
          disabled={!form.district}
        >
          <option value="" disabled>Select Upazila</option>
          {(upazilasByDistrict[form.district] || []).map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        <button
          type="submit"
          className="btn btn-primary col-span-3 md:col-span-1"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {isLoading && <p>Searching donors...</p>}

      {query && !isLoading && (
        <>
          {donors.length === 0 ? (
            <p>No donors found for the selected criteria.</p>
          ) : (
            <div className="grid gap-4">
              {donors.map(donor => (
                <div
                  key={donor._id}
                  className="p-4 border rounded shadow bg-base-100"
                >
                  <img src={donor.avatar} alt="Donor Photo" className='w-50 h-50'/>
                  <h3 className="text-xl font-semibold">{donor.name}</h3>
                  <p>Email: {donor.email}</p>
                  <p>
                    Blood Group: <strong>{donor.blood_group}</strong>
                  </p>
                  <p>
                    District: {donor.district} | Upazila: {donor.upazila}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div></>
  );
};

export default DonorSearch;
