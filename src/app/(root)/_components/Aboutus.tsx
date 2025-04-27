'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaRocket, FaShieldAlt } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Ahmed Hassan',
    role: 'Frontend Developer',
    image: '/Ahmad.jpg',
    description: 'Full Stack Engineer with a strong aspiration in AI/ML.',
    social: {
      github: 'https://github.com/Ahmadhassan30',
      linkedin: 'https://linkedin.com/in/ahmad-hassan3110',
    },
  },
  {
    name: 'Muhammad Hassan Ali',
    role: 'Backend Developer',
    image: '/Hassan.jpg',
    description:
      'Full Stack Engineer with a passion for creating scalable applications.',
    social: {
      github: 'https://github.com/MHassanAli1',
      linkedin: 'https://linkedin.com/in/muhammad-hassan-ali1',
    },
  },
  {
    name: 'Mohid Naeem',
    role: 'Backend Developer',
    image: '/Mohid.jpg',
    description:
      'Full Stack Engineer with a keen interest in Web 3.0 and Blockchain.',
    social: {
      github: 'https://github.com/nexcodes',
      linkedin: 'https://www.linkedin.com/in/mian-mohid-mohid',
    },
  },
];

const AboutUs = () => {
  return (
    <div className='bg-gray-900 text-white min-h-screen'>
      {/* Hero Section */}
      <motion.section
        className='relative py-20 px-6 overflow-hidden'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className='absolute inset-0 z-0'
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9)),
                linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)`,
            backgroundSize: '100%, 40px 40px, 40px 40px',
          }}
        />

        <div className='max-w-4xl mx-auto relative z-10 text-center'>
          <motion.div
            className='flex justify-center mb-6'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3'>
              <FaShieldAlt className='text-white text-2xl' />
            </div>
          </motion.div>

          <motion.h1
            className='text-4xl md:text-5xl font-bold mb-2'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Nigheban.pk
          </motion.h1>

          <motion.p
            className='text-lg md:text-xl text-blue-400 mb-6'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            by Cache Crew
          </motion.p>

          <motion.p
            className='text-xl text-gray-300 mb-8'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Empowering citizens to report crimes and build safer communities
          </motion.p>
        </div>
      </motion.section>

      {/* Meet the Team */}
      <section className='py-16 px-6 bg-gray-900/80 backdrop-blur-md border-t border-gray-800'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            className='text-center mb-12'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl font-bold mb-4'>Meet the Cache Crew</h2>
            <div className='h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto'></div>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8'>
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className='bg-gradient-to-b from-gray-800/80 to-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700'
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
                  transition: { duration: 0.4 },
                }}
              >
                {/* Top gradient bar */}
                <div className='h-2 bg-gradient-to-r from-blue-500 to-blue-600'></div>

                <div className='p-8 flex flex-col items-center text-center'>
                  {/* Image with glow effect on hover - increased size */}
                  <motion.div
                    className='w-40 h-40 rounded-full mb-6 relative'
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 blur-lg opacity-50'></div>
                    <div className='absolute inset-0 rounded-full overflow-hidden border-2 border-blue-500'>
                      <img
                        src={member.image}
                        alt={member.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </motion.div>

                  <h3 className='text-2xl font-semibold text-white mb-1'>
                    {member.name}
                  </h3>
                  <p className='text-blue-400 font-medium mb-4'>
                    {member.role}
                  </p>

                  <p className='text-gray-300 mb-6'>{member.description}</p>

                  {/* Social links */}
                  <div className='flex gap-4 mt-2'>
                    <motion.a
                      href={member.social.github}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-400 hover:text-white transition-colors'
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <FaGithub size={20} />
                    </motion.a>
                    <motion.a
                      href={member.social.linkedin}
                      target='_blank'
                      rel='noreferrer'
                      className='text-gray-400 hover:text-white transition-colors'
                      whileHover={{ scale: 1.2, rotate: -5 }}
                    >
                      <FaLinkedin size={20} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className='py-16 px-6 bg-gradient-to-b from-gray-900 to-gray-800'>
        <div className='max-w-4xl mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className='flex justify-center mb-6'>
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3'>
                <FaRocket className='text-white text-2xl' />
              </div>
            </div>

            <h2 className='text-3xl font-bold mb-6'>Join Our Safety Network</h2>
            <p className='text-gray-300 text-lg mb-8'>
              Be part of a community-driven effort to reduce crime and build
              safer neighborhoods. Every report helps authorities respond faster
              and protect more citizens across Pakistan.
            </p>

            <Link
              href='/signup'
              className='inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            >
              Report Crime Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
