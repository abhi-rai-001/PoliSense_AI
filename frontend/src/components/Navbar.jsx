import React from 'react'



const Navbar = () => {
  return (
    <div className='w-[100vw] fixed flex justify-between items-center z-10 px-20 py-10 backdrop-blur-md bg-black/10  text-white'>
      <div className='font-[TAN-KULTURE] cursor-none tracking-wider text-2xl uppercase'> Polisense.AI
    </div>
      
      <div className='flex justify-around w-1/2 pl-10'> 
        <button className='cta '> <span className="hover-underline-animation px-1"> Home </span> </button>
        <button className='cta '> <span className="hover-underline-animation px-1"> About Us </span> </button>
        <button className='cta '> <span className="hover-underline-animation px-1"> Contact Us </span> </button>
        <button className='active'> <span className="px-1"> Login </span> </button>
         </div>
    </div>
  )
}

export default Navbar
