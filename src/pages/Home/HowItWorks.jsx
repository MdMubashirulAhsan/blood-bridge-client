import React from 'react';

const HowItWorks = () => {
  return (
    <section className="bg-base-100 py-16 px-6 text-center">
      <h2 className="text-4xl font-bold text-primary mb-10">How Blood Donation Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="p-6 bg-base-200 rounded-2xl shadow hover:shadow-xl transition">
          <div className="text-5xl text-secondary mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">1. Register a Request</h3>
          <p>Need blood? Just submit a request with details like group, location & time.</p>
        </div>
        <div className="p-6 bg-base-200 rounded-2xl shadow hover:shadow-xl transition">
          <div className="text-5xl text-accent mb-4">🔔</div>
          <h3 className="text-xl font-semibold mb-2">2. Donors Get Notified</h3>
          <p>Nearby verified donors are notified and can respond immediately.</p>
        </div>
        <div className="p-6 bg-base-200 rounded-2xl shadow hover:shadow-xl transition">
          <div className="text-5xl text-primary mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2">3. Donation Happens</h3>
          <p>Both parties connect securely and arrange the life-saving donation.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
