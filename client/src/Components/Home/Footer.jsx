import React from 'react'
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
const Footer = () => {
    const navigate = useNavigate();
    return (
        <>
            <footer className='bg-gradient-to-r from-white via-green-200/60 to-white py-12 px-4 sm:px-6 lg:px-8 mt-40 '>
                <div className='w-full max-w-7xl mx-auto'>

                    <div className="flex flex-wrap justify-between gap-y-12 lg:gap-x-8">

                        <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-center md:items-start text-center md:text-left">

                            <img src={logo} onClick={() => navigate("/")} className='cursor-pointer' />
                            <div className='w-full max-w-52 h-px mt-8 bg-linear-to-r from-black via-white/25 to-black'></div>
                            <p className='text-sm text-black/60 mt-6 max-w-sm leading-relaxed '>
                                PrebuiltUI is a growing collection of beautifully designed, production-ready Tailwind CSS UI components.
                            </p>
                        </div>
                        <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-sm text-black font-medium'>Important Links</h3>
                            <div className="flex flex-col gap-2 mt-6">
                                <a href="#" className='text-sm text-black/60 hover:text-black transition-colors'>Home</a>
                                <a href="#" className='text-sm text-black/60 hover:text-black transition-colors'>About</a>
                                <a href="https://myportfolio-nd15.onrender.com" className='text-sm text-black/60 hover:text-black transition-colors'>Portfolio</a>
                                <a href="https://myportfolio-nd15.onrender.com" className='text-sm text-black/60 hover:text-black transition-colors'>Contact</a>
                                <a href="#" className='text-sm text-black/60 hover:text-black transition-colors'>FAQ</a>
                            </div>
                        </div>

                        <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-sm text-black font-medium'>Social Links</h3>
                            <div className="flex flex-col gap-2 mt-6">
                                {/* <a href="#" className='text-sm text-black/60 hover:text-black transition-colors'>Twitter</a> */}
                                <a href="#" className='text-sm text-black/60 hover:text-black transition-colors'>Instagram</a>
                                <a href="#" className='text-sm text-black/60 hover:text-black transition-colors'>Youtube</a>
                                <a href="#" className='text-sm text-black/60 hover:text-black transition-colors'>Linkedin</a>
                            </div>
                        </div>
                        <div className="w-full md:w-[45%] lg:w-[25%] flex flex-col items-center md:items-start text-center md:text-left">

                            <h3 className="text-sm text-black font-medium">
                                Subscribe for news
                            </h3>

                            <div className="flex items-center border gap-2 border-black/20 h-12 max-w-80 w-full rounded-full overflow-hidden mt-4">

                                <input
                                    type="email"
                                    placeholder="Enter your email.."
                                    className="w-full h-full pl-6 outline-none text-sm bg-transparent text-black placeholder-black/60 placeholder:text-xs"
                                    required
                                />

                                <button onClick={()=> window.alert("Subscribe Sucessfully")}
                                    type="submit"
                                    className="bg-gradient-to-b from-[#5623D8] to-[#7B53E2] active:scale-95 transition w-56 h-10 rounded-full text-sm text-white cursor-pointer mr-1.5"
                                >
                                    Subscribe
                                </button>

                            </div>
                        </div>

                    </div>

                    <div className='w-full h-px mt-16 mb-4 bg-linear-to-r from-black via-white/25 to-black'></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className='text-xs text-black/60'>© 2026 Sanskar</p>
                        <div className="flex items-center gap-6">
                            <a href='#' className='text-xs text-black/60 hover:text-black transition-colors'>Terms & Conditions</a>
                            <div className='w-px h-4 bg-white/20'></div>
                            <a href='#' className='text-xs text-black/60 hover:text-black transition-colors'>Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
            
                * {
                    font-family: "Poppins", sans-serif;
                }
            `}</style>
        </>
    )
}

export default Footer