import CTASignup from '@/app/(root)/_components/CTASignup';
import FeatureCards from '@/app/(root)/_components/FeatureCards';
import LogoCarousel from '@/app/(root)/_components/LogoCarousel';
import VideoHero from '@/app/(root)/_components/VideoHero';
import Header from './_components/header';
export default function Home() {
  return (
    <>
      <Header />
      <VideoHero />
      <FeatureCards />
      <LogoCarousel />
      <CTASignup />
    </>
  );
}
