import React from 'react';
import { FaHandHoldingHeart, FaTint, FaHeartbeat } from 'react-icons/fa';

const features = [
  {
    icon: <FaHandHoldingHeart className="text-accent text-5xl" />,
    title: 'Save Lives',
    description:
      'Every blood donation can save up to three lives. Your generosity can give someone a second chance.',
  },
  {
    icon: <FaTint className="text-accent text-5xl" />,
    title: 'Easy Process',
    description:
      'Register, schedule, and donate — it only takes a few minutes to make a lifelong impact.',
  },
  {
    icon: <FaHeartbeat className="text-accent text-5xl" />,
    title: 'Health Benefits',
    description:
      'Donating regularly can improve heart health and reduce harmful iron stores in your body.',
  },
];

const Featured = () => {
  return (
    <section className=" bg-base-200">
      <div className=" mx-auto ">
        <h2 className="text-3xl text-center md:text-4xl font-bold  mb-12 text-primary">
          Why Donate Blood?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition text-left flex items-center gap-4"
            >
              <div className="mt-1">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
