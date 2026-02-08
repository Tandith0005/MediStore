
import React from "react";
import Hero from "@/components/layout/Hero";
import Process from "@/components/layout/Process";
import Questions from "@/components/layout/Questions";
import Reviews from "@/components/layout/Reviews";

export default function Home() {
  return (
    <div>
      {/* First Section */}
      <Hero></Hero>
      {/* Second Section */}
      <Process></Process>
      {/* Third Section */}
      <Questions></Questions>
      {/* Fourth Section */}
      <Reviews></Reviews>

    </div>
  );
}
