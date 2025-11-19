import React from "react";
import welcomeimg from '../assets/welcome.png';
import welcomicon from '../assets/welcome_icon.png';

export default function Welcome({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#e6eef9] px-6 md:px-12 lg:px-20 py-8 relative overflow-x-hidden">
      {/* full-viewport background filler to guarantee bg covers entire page */}
      <div className="absolute inset-0 -z-20 bg-[#e6eef9]" />

      {/* top-left circular logo (slightly overlapping) */}
      <div className="absolute left-6 top-6 z-30 -translate-y-2 -translate-x-1">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center shadow-lg border-4 border-white">
          <img src={welcomicon} alt="logo" className="w-16 h-16 object-contain" />
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto md:pl-12">
        {/* Title / subtitle */}
        <div className="pt-6 md:pt-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#244a78] inline-block">
            PlanAce - Project Management System
          </h1>
          <p className="mt-3 text-base sm:text-lg md:text-xl font-semibold text-[#3b5f8a]">
            Ace your plan, A place to shine
          </p>
        </div>

        {/* Below title: left = welcome image, right = Get Started button */}
        <div className="mt-8 flex flex-col md:flex-row items-center md:items-center justify-between gap-8 py-8">
          {/* left: illustration */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div className="bg-transparent rounded-none p-4 md:p-6 w-full max-w-[600px] max-h-[450px] overflow-hidden">
              <img
                src={welcomeimg}
                alt="Welcome illustration"
                className="w-full h-auto max-h-full object-contain"
              />
            </div>
          </div>

          {/* right: big pill Get Started button */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <button
              onClick={() => {
                if (onGetStarted) onGetStarted();
                else window.location.href = "/login";
              }}
              className="self-start mt-4 md:mt-0 w-[300px] sm:w-[340px] md:w-[420px] h-[100px] sm:h-[110px] md:h-[130px] rounded-[80px] bg-[#5e8bcb] text-white font-extrabold text-2xl md:text-4xl shadow-[0_18px_36px_rgba(46,88,148,0.22)] hover:-translate-y-2 transition-transform"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}