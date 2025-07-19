import React from 'react'

const Pricing = () => {
  return (
           <section className="py-20 px-8 max-w-6xl mx-auto text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
             <p className="text-gray-700 mb-12">
               Start free and upgrade as you grow.
             </p>
             <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
                 <h3 className="text-xl font-semibold mb-2">Free</h3>
                 <p className="text-gray-700 mb-4">
                   Basic features to explore PoliSense_AI.
                 </p>
                 <p className="text-2xl font-bold mb-4">$0</p>
                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full">
                   Start Free
                 </button>
               </div>
               <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
                 <h3 className="text-xl font-semibold mb-2">Pro</h3>
                 <p className="text-gray-700 mb-4">
                   Advanced AI analysis & larger docs.
                 </p>
                 <p className="text-2xl font-bold mb-4">$29/mo</p>
                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full">
                   Get Pro
                 </button>
               </div>
               <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
                 <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                 <p className="text-gray-700 mb-4">
                   Custom solutions & dedicated support.
                 </p>
                 <p className="text-2xl font-bold mb-4">Contact us</p>
                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full">
                   Contact Sales
                 </button>
               </div>
             </div>
           </section>
       
  )
}

export default Pricing
