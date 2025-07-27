import React from 'react'
import { Link } from 'react-router-dom'
import GeometricLogo from './GeometricLogo'
import {  SignedOut, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {

const {isSignedIn} = useUser();

  return (
    <div className='w-[100vw] fixed flex justify-between items-center z-10 px-20 py-10 backdrop-blur-md bg-black/10  text-white'>
      <Link to="/" className='font-[TAN-KULTURE] items-center flex cursor-pointer tracking-wider text-2xl uppercase hover:text-gray-300 transition-colors'> 
       Polisense <GeometricLogo className='size-20'/>
      </Link>
      
      <div className={`flex justify-around items-center ${isSignedIn?'w-2/5':'w-1/2'} `}> 
        <Link to="/" className='cta'> 
          <span className="hover-underline-animation px-1"> Home </span> 
        </Link>
        <Link to="/about" className='cta'> 
          <span className="hover-underline-animation px-1"> About Us </span> 
        </Link>
        <Link to="/contact" className='cta'> 
          <span className="hover-underline-animation px-1"> Contact Us </span> 
        </Link>
        <SignedOut>
        <Link to="/sign-in" className='active'> 
          <span className="px-1"> Login </span> 
        </Link>
        </SignedOut>

        {isSignedIn && (
          <div className="scale-150">
             <UserButton/>
          </div>
        )
         }


      </div>
    </div>
  )
}

export default Navbar
