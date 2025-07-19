import React from 'react'

const Contact = () => {
  return (
        
        <section className="py-20 px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-8">Have questions? Reach out below.</p>
          <form className="max-w-xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-purple-500"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold"
            >
              Send Message
            </button>
          </form>
        </section>
     
  )
}

export default Contact
