'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CrimeListings from '../_components/crime-listing';
import SafetyTips from '../_components/safety-tips';

const CrimeReportPage = () => {
  return (
    <div className='bg-gray-900 text-white min-h-screen'>
      <section className='relative py-20 px-6'>
        <div
          className='absolute inset-0 z-0'
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9)),
              url('/report-hero.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className='max-w-5xl mx-auto relative z-10 text-center'>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className='inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-600 rounded-full'>
              <Shield className='text-white text-2xl' />
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Community Crime Reports
            </h1>

            <p className='text-xl text-gray-300 max-w-3xl mx-auto mb-8'>
              Report incidents and stay informed about safety concerns in your
              area. Together, we can create safer communities.
            </p>

            <Link href='/report/create'>
              <Button className='bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto rounded-lg'>
                Report an Incident
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Reports Section */}
      <CrimeListings />

      {/* Safety Tips Section */}
      <SafetyTips />
    </div>
  );
};

export default CrimeReportPage;
