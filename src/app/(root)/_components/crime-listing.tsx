'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useGetCrimes } from '@/app/(main)/_api/use-get-crimes';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CrimeType } from '@prisma/client';
import CrimeCard from './crime-cards';

const CrimeListings = () => {
  const { data: crimesData = [], isLoading } = useGetCrimes();
  const router = useRouter();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort reports
  const filteredReports = crimesData
    .filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Categories' ||
        report.crimeType === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  // Handle viewing a crime
  const handleViewCrime = (id: string) => {
    router.push(`/report/${id}`);
  };

  return (
    <section className='py-16 px-6 bg-gray-900'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700'>
          <div className='flex flex-col md:flex-row gap-6'>
            {/* Search Bar */}
            <div className='flex-grow'>
              <div className='relative'>
                <Input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Search reports...'
                  className='w-full bg-gray-700 border-gray-600 pl-10 text-white focus-visible:ring-blue-500'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              </div>
            </div>

            {/* Filter by Category */}
            <div className='w-full md:w-60'>
              <div className='relative'>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className='w-full bg-gray-700 border-gray-600 pl-10 text-white focus:ring-blue-500'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-700 border-gray-600 text-white'>
                    <SelectItem value='All Categories'>
                      All Categories
                    </SelectItem>

                    {Object.keys(CrimeType).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10' />
              </div>
            </div>

            {/* Sort By */}
            <div className='w-full md:w-60'>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-full bg-gray-700 border-gray-600 text-white focus:ring-blue-500'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent className='bg-gray-700 border-gray-600 text-white'>
                  <SelectItem value='newest'>Newest First</SelectItem>
                  <SelectItem value='oldest'>Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : filteredReports.length > 0 ? (
          <div className='space-y-8'>
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CrimeCard crime={report} onViewCrime={handleViewCrime} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='text-center py-20 bg-gray-800/30 rounded-xl border border-gray-700'>
            <AlertTriangle className='text-yellow-500 text-5xl mx-auto mb-4' />
            <h3 className='text-xl font-medium mb-2'>No Reports Found</h3>
            <p className='text-gray-400 mb-6'>
              No incident reports match your search criteria.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
              }}
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CrimeListings;
