import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const phoneNumber = "919512630475"; // your WhatsApp number (with country code)

  const text = `Hello, I have a query:
  
Name: ${form.name}
Email: ${form.email}
Message: ${form.message}`;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

  window.open(whatsappURL, "_blank");

  setForm({
    name: "",
    email: "",
    message: "",
  });
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8">
        
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Contact Us
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Have questions about PG bookings? Feel free to reach out!
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Get in Touch</h3>

            <p><strong>📍 Address:</strong> Ahmedabad, Gujarat</p>
            <p><strong>📞 Phone:</strong> +91 9876543210</p>
            <p><strong>📧 Email:</strong> adminpg@gmail.com</p>

            <p className="text-gray-500">
              We usually respond within 24 hours.
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>

            

<button className="flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-lg">
  <FaWhatsapp size={20} />
  Send via WhatsApp
</button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default ContactUs;