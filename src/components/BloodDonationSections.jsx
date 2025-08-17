import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Phone, Mail, Info } from "lucide-react";

// Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`py-16 md:py-24 ${className}`}>{children}</section>
);

// UPCOMING DRIVES
const UpcomingDrives = () => (
  <Section id="drives" className="bg-base-100">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <motion.h2 initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }} className="text-2xl md:text-4xl font-bold mb-8 text-center text-primary">Upcoming Blood Drives</motion.h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[{
          date: "Aug 25, 2025",
          place: "City Hospital, Sylhet",
          details: "Community hall, 9 AM – 4 PM"
        }, {
          date: "Sep 10, 2025",
          place: "Greenwood College, Dhaka",
          details: "Auditorium, 10 AM – 3 PM"
        }, {
          date: "Sep 20, 2025",
          place: "Central Mall, Chittagong",
          details: "Ground floor, 11 AM – 5 PM"
        }].map((drive, i) => (
          <motion.div key={i} initial="hidden" whileInView="show" variants={fadeUp} className="p-6 bg-base-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 font-semibold"><Calendar className="w-5 h-5 text-primary" /> {drive.date}</div>
            <div className="flex items-center gap-2 mb-1"><MapPin className="w-5 h-5 text-secondary" /> <span className="font-medium">{drive.place}</span></div>
            <p className="text-sm text-base-content/70">{drive.details}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

// PREPARATION TIPS
const PreparationTips = () => (
  <Section id="preparation" className="bg-base-200">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <motion.h2 initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }} className="text-2xl md:text-4xl font-bold mb-8 text-center text-primary">Preparation Tips</motion.h2>
      <ul className="grid md:grid-cols-2 gap-6 text-base-content/80">
        {["Drink plenty of water the day before donation", "Eat a healthy meal within 2 hours before donating", "Avoid fatty foods before donation", "Bring a valid ID with you", "Get a good night’s sleep before your appointment", "Wear comfortable clothes with sleeves that roll up easily"].map((tip, i) => (
          <motion.li key={i} initial="hidden" whileInView="show" variants={fadeUp} className="p-4 bg-base-100 rounded-xl shadow-sm">• {tip}</motion.li>
        ))}
      </ul>
    </div>
  </Section>
);

// FAQ SECTION
const FAQ = () => (
  <Section id="faq" className="bg-base-100">
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      <motion.h2 initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }} className="text-2xl md:text-4xl font-bold mb-8 text-center text-primary">Frequently Asked Questions</motion.h2>
      <div className="space-y-6">
        {[{
          q: "How often can I donate blood?",
          a: "You can safely donate whole blood every 3 months (90 days) if you meet the health criteria."
        }, {
          q: "Is blood donation painful?",
          a: "The only pain is a quick needle prick at the start. The process itself is safe and painless."
        }, {
          q: "What should I do after donating?",
          a: "Rest for 10–15 minutes, drink water, and enjoy the snacks provided to re-energize yourself."
        }].map((faq, i) => (
          <motion.div key={i} initial="hidden" whileInView="show" variants={fadeUp} className="p-6 bg-base-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-accent mt-1" />
              <div>
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-base-content/70">{faq.a}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

// Export All Sections
export default function BloodDonationSections() {
  return (
    <>
      <UpcomingDrives />
      <PreparationTips />
      <FAQ />
    </>
  );
}
