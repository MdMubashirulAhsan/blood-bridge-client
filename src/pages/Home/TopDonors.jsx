import React from 'react';

const donors = [
  {
    id: 1,
    name: 'Rahim Miah',
    bloodGroup: 'B+',
    donations: 4,
    imgUrl: 'https://i.pravatar.cc/100?img=11',
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    bloodGroup: 'O-',
    donations: 3,
    imgUrl: 'https://i.pravatar.cc/100?img=32',
  },
  {
    id: 3,
    name: 'Tanvir Hossain',
    bloodGroup: 'A+',
    donations: 5,
    imgUrl: 'https://i.pravatar.cc/100?img=41',
  },
];

const TopDonors = () => {
  return (
    <section className="bg-base-200 py-16  text-center">
      <h2 className="text-4xl font-bold text-primary mb-10">Top Donors of the Month</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {donors.map(({ id, name, bloodGroup, donations, imgUrl }) => (
          <div key={id} className="bg-base-100 rounded-2xl shadow-lg p-6">
            <img
              src={imgUrl}
              alt={name}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-gray-500">Blood Group: {bloodGroup}</p>
            <p className="mt-2 font-bold text-success">{donations} Donations</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopDonors;
