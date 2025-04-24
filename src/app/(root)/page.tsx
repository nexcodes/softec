import VideoHero from "@/app/(root)/_components/VideoHero";
import FeatureCards from "@/app/(root)/_components/FeatureCards";
import LogoCarousel from "@/app/(root)/_components/LogoCarousel";
import CTASignup from "@/app/(root)/_components/CTASignup";
import Header from "./_components/header";

export default function Home() {
  return (
    <main className="bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: "url('/image.jpg')",
        }}
      ></div>

      <div className="max-w-7xl mx-auto p-4">
        <Header />
        <VideoHero />

        <FeatureCards />
        <LogoCarousel />
      </div>
      <CTASignup />
    </main>
  );
}
