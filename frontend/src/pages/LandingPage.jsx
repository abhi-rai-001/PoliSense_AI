import React from "react";
import Hero from "@/components/Hero";
import Info from "@/components/Info";
import Secure from "@/components/Secure";
import Languages from "@/components/Languages";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Info />
      <Secure/>
      <Languages/>
      <SocialProof/>
      <FAQ/>
    </div>
  );
}
