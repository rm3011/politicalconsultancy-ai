import Hero from "@/components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Impacts from "./components/Impacts";
import CTASection from "./components/CTASection";


export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <Services />
      <Impacts />
      <CTASection />
    </main>
  );
}