'use client';

import type React from 'react';

// pages/crime-map.tsx
import useLocation from '@/hooks/use-location';
import { CrimeType } from '@prisma/client';
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useGetMapAnalytics } from '../_api/use-get-map-analytics';

// Map component configuration
const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

// Different marker colors based on crime type
const getMarkerIcon = (crimeType: CrimeType): string => {
  switch (crimeType) {
    case CrimeType.HOMICIDE:
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    case CrimeType.ASSAULT:
      return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    case CrimeType.THEFT:
      return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    case CrimeType.ROBBERY:
      return 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
    case CrimeType.BURGLARY:
      return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    case CrimeType.ARSON:
      return 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png';
    case CrimeType.VANDALISM:
      return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    case CrimeType.FRAUD:
      return 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png';
    case CrimeType.EMBEZZLEMENT:
      return 'http://maps.google.com/mapfiles/ms/icons/cyan-dot.png';
    case CrimeType.KIDNAPPING:
      return 'http://maps.google.com/mapfiles/ms/icons/brown-dot.png';
    case CrimeType.CYBERCRIME:
      return 'http://maps.google.com/mapfiles/ms/icons/white-dot.png';
    case CrimeType.DRUG_TRAFFICKING:
      return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
    case CrimeType.RAPE:
      return 'http://maps.google.com/mapfiles/ms/icons/darkgreen-dot.png';
    default:
      return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  }
};

// Color mapping for the legend
const crimeTypeColors: Record<CrimeType, string> = {
  [CrimeType.HOMICIDE]: 'bg-red-600',
  [CrimeType.ASSAULT]: 'bg-orange-500',
  [CrimeType.THEFT]: 'bg-blue-500',
  [CrimeType.ROBBERY]: 'bg-purple-500',
  [CrimeType.BURGLARY]: 'bg-yellow-500',
  [CrimeType.ARSON]: 'bg-pink-500',
  [CrimeType.VANDALISM]: 'bg-green-500',
  [CrimeType.FRAUD]: 'bg-blue-300',
  [CrimeType.EMBEZZLEMENT]: 'bg-cyan-500',
  [CrimeType.KIDNAPPING]: 'bg-amber-700',
  [CrimeType.CYBERCRIME]: 'bg-gray-100 border border-gray-400',
  [CrimeType.DRUG_TRAFFICKING]: 'bg-gray-500',
  [CrimeType.RAPE]: 'bg-green-800',
};

// Chart colors for consistency
const chartColors: Record<CrimeType, string> = {
  [CrimeType.HOMICIDE]: '#dc2626',
  [CrimeType.ASSAULT]: '#f97316',
  [CrimeType.THEFT]: '#3b82f6',
  [CrimeType.ROBBERY]: '#a855f7',
  [CrimeType.BURGLARY]: '#eab308',
  [CrimeType.ARSON]: '#ec4899',
  [CrimeType.VANDALISM]: '#22c55e',
  [CrimeType.FRAUD]: '#93c5fd',
  [CrimeType.EMBEZZLEMENT]: '#06b6d4',
  [CrimeType.KIDNAPPING]: '#b45309',
  [CrimeType.CYBERCRIME]: '#f3f4f6',
  [CrimeType.DRUG_TRAFFICKING]: '#6b7280',
  [CrimeType.RAPE]: '#166534',
};

// Format date for display
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Custom tooltip for Recharts
/* eslint-disable-line @typescript-eslint/no-explicit-any */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-gray-800 p-3 border border-gray-700 rounded shadow text-gray-200'>
        <p className='font-semibold'>{label}</p>
        <p className='text-sm'>{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CrimeMap: React.FC = () => {
  const [filter, setFilter] = useState<CrimeType | null>(null);
  const [timeRange, setTimeRange] = useState<number>(30); // days
  const [view, setView] = useState<'map' | 'analytics'>('map');

  const { data: crimes, isLoading } = useGetMapAnalytics();

  const Tcrime = crimes?.[0];

  const [selectedCrime, setSelectedCrime] = useState<typeof Tcrime | null>(
    null
  );

  // Filter crimes based on selected type and time range
  const filteredCrimes = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date(now.setDate(now.getDate() - timeRange));

    return crimes?.filter((crime) => {
      const typeMatch = filter ? crime.crimeType === filter : true;
      const dateMatch = crime.reportedAt
        ? new Date(crime.reportedAt) >= new Date(cutoffDate)
        : true;
      return typeMatch && dateMatch;
    });
  }, [crimes, filter, timeRange]);

  // Prepare crime type statistics for charts
  const crimeTypeData = useMemo(() => {
    const counts: Record<CrimeType, number> = Object.values(CrimeType).reduce(
      (acc, type) => {
        acc[type] = 0;
        return acc;
      },
      {} as Record<CrimeType, number>
    );

    filteredCrimes?.forEach((crime) => {
      counts[crime.crimeType]++;
    });

    // Convert to format suitable for Recharts
    return Object.entries(counts)
      .map(([type, count]) => ({
        name: type.replace(/_/g, ' '),
        value: count,
        color: chartColors[type as CrimeType],
      }))
      .filter((item) => item.value > 0);
  }, [filteredCrimes]);

  // Group crimes by day for timeline
  const timelineData = useMemo(() => {
    const data: Record<string, number> = {};

    filteredCrimes?.forEach((crime) => {
      if (crime.reportedAt) {
        const dateKey = new Date(crime.reportedAt).toISOString().split('T')[0];
        data[dateKey] = (data[dateKey] || 0) + 1;
      }
    });

    // Sort by date and format for Recharts
    return Object.entries(data)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(-14) // Last 14 days for clarity
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        count,
      }));
  }, [filteredCrimes]);

  // Get crime hotspots (locations with multiple crimes)
  const hotspotData = useMemo(() => {
    const locationCounts: Record<string, number> = {};

    filteredCrimes?.forEach((crime) => {
      locationCounts[crime.location] =
        (locationCounts[crime.location] || 0) + 1;
    });

    return Object.entries(locationCounts)
      .filter(([_, count]) => count > 1)
      .map(([location, count]) => ({
        name: location,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredCrimes]);

  const { longitude, latitude } = useLocation();

  const center = {
    lat: latitude || 31.5204,
    lng: longitude || 74.3587,
  };

  return (
    <div className='bg-gray-900 text-gray-200 min-h-screen mt-12'>
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-4 text-gray-100'>
          Crime Map Analytics Dashboard
        </h1>

        <div className='flex justify-between items-center mb-6'>
          <div className='flex space-x-4'>
            <button
              className={`px-4 py-2 rounded ${
                view === 'map'
                  ? 'bg-gray-700 text-gray-100'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setView('map')}
            >
              Map View
            </button>
            <button
              className={`px-4 py-2 rounded ${
                view === 'analytics'
                  ? 'bg-gray-700 text-gray-100'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setView('analytics')}
            >
              Analytics View
            </button>
          </div>

          <div className='flex items-center space-x-2'>
            <span>Time Range:</span>
            <select
              className='border border-gray-700 rounded p-2 bg-gray-800 text-gray-200'
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        <div className='bg-gray-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-700'>
          <h2 className='text-xl font-semibold mb-2 text-gray-100'>
            Filter by Crime Type
          </h2>
          <div className='flex flex-wrap gap-2 mb-4'>
            <button
              className={`px-3 py-1 rounded ${
                !filter
                  ? 'bg-gray-600 text-gray-100'
                  : 'bg-gray-700 text-gray-300'
              }`}
              onClick={() => setFilter(null)}
            >
              All
            </button>
            {Object.values(CrimeType).map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded ${
                  filter === type
                    ? 'bg-gray-600 text-gray-100'
                    : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setFilter(type)}
              >
                {type.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {view === 'map' ? (
          <div className='space-y-4'>
            <div className='bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700'>
              <h2 className='text-xl font-semibold mb-4 text-gray-100'>
                Crime Statistics
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='rounded-lg bg-gray-700 p-4 shadow border border-gray-600'>
                  <h3 className='text-lg font-semibold mb-2 text-gray-200'>
                    Total Incidents
                  </h3>
                  <p className='text-4xl font-bold text-gray-100'>
                    {filteredCrimes?.length}
                  </p>
                </div>
                <div className='rounded-lg bg-gray-700 p-4 shadow border border-gray-600'>
                  <h3 className='text-lg font-semibold mb-2 text-gray-200'>
                    Most Common Crime
                  </h3>
                  {crimeTypeData.length > 0 ? (
                    <p className='text-xl font-bold text-gray-100'>
                      {crimeTypeData.sort((a, b) => b.value - a.value)[0].name}
                    </p>
                  ) : (
                    <p className='text-gray-400'>No data available</p>
                  )}
                </div>
                <div className='rounded-lg bg-gray-700 p-4 shadow border border-gray-600'>
                  <h3 className='text-lg font-semibold mb-2 text-gray-200'>
                    Last Reported
                  </h3>
                  {filteredCrimes && filteredCrimes?.length > 0 ? (
                    <p className='text-xl font-bold text-gray-100'>
                      {formatDate(
                        new Date(
                          [...filteredCrimes].sort(
                            (a, b) =>
                              new Date(b.reportedAt).getTime() -
                              new Date(a.reportedAt).getTime()
                          )[0].reportedAt
                        )
                      )}
                    </p>
                  ) : (
                    <p className='text-gray-400'>No data available</p>
                  )}
                </div>
              </div>
            </div>
            <div className='bg-gray-800 rounded-lg shadow-lg border border-gray-700'>
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={13}
                  options={{
                    styles: [
                      {
                        elementType: 'geometry',
                        stylers: [{ color: '#242f3e' }],
                      },
                      {
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#242f3e' }],
                      },
                      {
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#746855' }],
                      },
                      {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }],
                      },
                      {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }],
                      },
                      {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#263c3f' }],
                      },
                      {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#6b9a76' }],
                      },
                      {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#38414e' }],
                      },
                      {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#212a37' }],
                      },
                      {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9ca5b3' }],
                      },
                      {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#746855' }],
                      },
                      {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#1f2835' }],
                      },
                      {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#f3d19c' }],
                      },
                      {
                        featureType: 'transit',
                        elementType: 'geometry',
                        stylers: [{ color: '#2f3948' }],
                      },
                      {
                        featureType: 'transit.station',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }],
                      },
                      {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#17263c' }],
                      },
                      {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#515c6d' }],
                      },
                      {
                        featureType: 'water',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#17263c' }],
                      },
                    ],
                  }}
                >
                  {filteredCrimes?.map((crime) => (
                    <Marker
                      key={crime.id}
                      position={{
                        lat: crime.latitude,
                        lng: crime.longitude,
                      }}
                      icon={getMarkerIcon(crime.crimeType)}
                      onClick={() => setSelectedCrime(crime)}
                    />
                  ))}

                  {selectedCrime && (
                    <InfoWindow
                      position={{
                        lat: selectedCrime.latitude,
                        lng: selectedCrime.longitude,
                      }}
                      onCloseClick={() => setSelectedCrime(null)}
                    >
                      <div className='p-2 max-w-xs bg-gray-800 text-gray-200'>
                        <h3 className='font-bold'>{selectedCrime.location}</h3>
                        <p className='text-sm mb-1'>
                          <span className='font-semibold'>Type:</span>{' '}
                          {selectedCrime.crimeType.replace(/_/g, ' ')}
                        </p>
                        {selectedCrime.reportedAt && (
                          <p className='text-sm mb-1'>
                            <span className='font-semibold'>Reported:</span>{' '}
                            {formatDate(new Date(selectedCrime.reportedAt))}
                          </p>
                        )}
                        {selectedCrime.description && (
                          <p className='text-sm mb-1'>
                            <span className='font-semibold'>Details:</span>{' '}
                            {selectedCrime.description}
                          </p>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
            <div className='bg-gray-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-700'>
              <h2 className='text-xl font-semibold mb-2 text-gray-100'>
                Legend
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                {Object.entries(CrimeType).map(([key, type]) => (
                  <div key={key} className='flex items-center'>
                    <div
                      className={`w-4 h-4 rounded-full mr-2 ${crimeTypeColors[type]}`}
                    ></div>
                    <span>{type.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700'>
            <h2 className='text-xl font-semibold mb-4 text-gray-100'>
              Crime Analytics
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-lg font-semibold mb-2 text-gray-200'>
                  Crime Type Distribution
                </h3>
                <div className='bg-gray-700 p-4 rounded-lg h-80 border border-gray-600'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={crimeTypeData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {crimeTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-2 text-gray-200'>
                  Crime Type Comparison
                </h3>
                <div className='bg-gray-700 p-4 rounded-lg h-80 border border-gray-600'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={crimeTypeData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray='3 3' stroke='#4b5563' />
                      <XAxis dataKey='name' stroke='#9ca3af' />
                      <YAxis allowDecimals={false} stroke='#9ca3af' />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey='value' name='Incidents'>
                        {crimeTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <h3 className='text-lg font-semibold mb-2 text-gray-200'>
                Incident Timeline
              </h3>
              <div className='bg-gray-700 p-4 rounded-lg h-64 border border-gray-600'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={timelineData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#4b5563' />
                    <XAxis dataKey='date' stroke='#9ca3af' />
                    <YAxis allowDecimals />
                    <XAxis dataKey='date' stroke='#9ca3af' />
                    <YAxis allowDecimals={false} stroke='#9ca3af' />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type='monotone'
                      dataKey='count'
                      name='Incidents'
                      stroke='#8884d8'
                      fill='#8884d8'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-2 text-gray-200'>
                Weekly Crime Trend
              </h3>
              <div className='bg-gray-700 p-4 rounded-lg h-64 border border-gray-600'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={timelineData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#4b5563' />
                    <XAxis dataKey='date' stroke='#9ca3af' />
                    <YAxis allowDecimals={false} stroke='#9ca3af' />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='count'
                      name='Incidents'
                      stroke='#9ca3af'
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className='mt-6'>
              <h3 className='text-lg font-semibold mb-2 text-gray-200'>
                Crime Locations ({filteredCrimes?.length})
              </h3>
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-gray-800 border border-gray-700'>
                  <thead className='bg-gray-700'>
                    <tr>
                      <th className='py-2 px-4 text-left text-gray-200'>
                        Location
                      </th>
                      <th className='py-2 px-4 text-left text-gray-200'>
                        Crime Type
                      </th>
                      <th className='py-2 px-4 text-left text-gray-200'>
                        Reported At
                      </th>
                      <th className='py-2 px-4 text-left text-gray-200'>
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrimes && filteredCrimes?.length > 0 ? (
                      filteredCrimes?.map((crime) => (
                        <tr
                          key={crime.id}
                          className='border-t border-gray-700 hover:bg-gray-700'
                        >
                          <td className='py-2 px-4'>{crime.location}</td>
                          <td className='py-2 px-4'>
                            <span
                              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                crimeTypeColors[crime.crimeType]
                              }`}
                            ></span>
                            {crime.crimeType.replace(/_/g, ' ')}
                          </td>
                          <td className='py-2 px-4'>
                            {crime.reportedAt
                              ? formatDate(new Date(crime.reportedAt))
                              : 'N/A'}
                          </td>
                          <td className='py-2 px-4'>
                            {crime.description || 'No details available'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className='py-4 text-center text-gray-400'
                        >
                          No crimes found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrimeMap;
