import { Card, CardContent } from '@/components/ui/card';

const SafetyTips = () => {
  return (
    <section className='py-12 px-6 bg-gray-800/50 border-t border-gray-700'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8 text-center'>Safety Tips</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='bg-gray-800 border-gray-700'>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-3'>
                Reporting Best Practices
              </h3>
              <ul className='text-gray-300 space-y-2'>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Include specific details like time, location, and descriptions
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Report incidents as soon as possible while memory is fresh
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Include photos when available and safe to capture
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='bg-gray-800 border-gray-700'>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-3'>Personal Safety</h3>
              <ul className='text-gray-300 space-y-2'>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Stay aware of your surroundings, especially at night
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Keep valuables out of sight in public places
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Travel in groups when possible in unfamiliar areas
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='bg-gray-800 border-gray-700'>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-3'>
                Community Vigilance
              </h3>
              <ul className='text-gray-300 space-y-2'>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Look out for your neighbors and their property
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Report suspicious activities to local authorities
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-400 mr-2'>•</span>
                  Join neighborhood watch groups to stay informed
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SafetyTips;
