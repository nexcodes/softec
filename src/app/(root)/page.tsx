import VideoHero from "@/app/(root)/_components/VideoHero";
import FeatureCards from "@/app/(root)/_components/FeatureCards";
import LogoCarousel from "@/app/(root)/_components/LogoCarousel";
import CTASignup from "@/app/(root)/_components/CTASignup";
import Header from "./_components/header";
import Footer from "@/app/(root)/_components/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <VideoHero />
      <FeatureCards />
      <LogoCarousel />
      <CTASignup />
      <Footer />
    </>
  );
}
