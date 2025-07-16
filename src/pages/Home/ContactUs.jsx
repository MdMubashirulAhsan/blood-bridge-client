import React from 'react';
import { useForm } from 'react-hook-form';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // Here you can integrate your email sending or API logic

    // Simulate success & reset
    return new Promise((resolve) => {
      setTimeout(() => {
        reset();
        resolve();
      }, 1500);
    });
  };

  return (
    <section className=" bg-base-100  mx-auto rounded p-10">
      <h2 className="text-3xl font-bold mb-12 text-primary text-center">
        Contact Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-red-500 text-2xl" />
            <div>
              <h3 className="font-semibold text-lg">Phone</h3>
              <p>+880 123 456 7890</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaEnvelope className="text-red-500 text-2xl" />
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p>support@blooddonate.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-red-500 text-2xl" />
            <div>
              <h3 className="font-semibold text-lg">Address</h3>
              <p>123 Blood St, Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-8 rounded-lg shadow"
        >
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              className="input input-bordered w-full"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your email address"
              className="input input-bordered w-full"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value:
                    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              placeholder="Write your message here"
              className="textarea textarea-bordered w-full"
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {isSubmitSuccessful && (
            <p className="text-green-600 mt-2 text-center">
              Your message has been sent successfully!
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
