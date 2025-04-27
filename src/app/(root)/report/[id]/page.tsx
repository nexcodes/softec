'use client';

import { useAddComment } from '@/app/(main)/_api/use-add-comment';
import { useGetCrime } from '@/app/(main)/_api/use-get-crime';
import Spinner from '@/components/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CrimeType, MediaType } from '@prisma/client';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  Send,
  Tag,
} from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { GoogleMapComponent } from '../../_components/google-map';

export default function CrimeDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const { data: crime, isLoading } = useGetCrime(id);
  const { mutate, isPending } = useAddComment(crime?.id);

  // Format date and time
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  // Get crime type badge color
  const getCrimeTypeColor = (type: CrimeType) => {
    switch (type) {
      case CrimeType.HOMICIDE:
        return 'bg-red-800 hover:bg-red-700 text-white';
      case CrimeType.ASSAULT:
        return 'bg-red-600 hover:bg-red-500 text-white';
      case CrimeType.THEFT:
        return 'bg-amber-600 hover:bg-amber-500 text-white';
      case CrimeType.ROBBERY:
        return 'bg-amber-700 hover:bg-amber-600 text-white';
      case CrimeType.BURGLARY:
        return 'bg-amber-800 hover:bg-amber-700 text-white';
      case CrimeType.ARSON:
        return 'bg-orange-700 hover:bg-orange-600 text-white';
      case CrimeType.VANDALISM:
        return 'bg-orange-500 hover:bg-orange-400 text-white';
      case CrimeType.FRAUD:
        return 'bg-purple-600 hover:bg-purple-500 text-white';
      case CrimeType.EMBEZZLEMENT:
        return 'bg-purple-700 hover:bg-purple-600 text-white';
      case CrimeType.KIDNAPPING:
        return 'bg-blue-800 hover:bg-blue-700 text-white';
      case CrimeType.CYBERCRIME:
        return 'bg-cyan-600 hover:bg-cyan-500 text-white';
      case CrimeType.DRUG_TRAFFICKING:
        return 'bg-green-700 hover:bg-green-600 text-white';
      case CrimeType.RAPE:
        return 'bg-pink-800 hover:bg-pink-700 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-400 text-white';
    }
  };

  // Get verification status badge color
  const getVerificationColor = (isVerified: boolean | null) => {
    if (isVerified === true)
      return 'bg-gray-600 hover:bg-gray-600 text-gray-100';
    if (isVerified === false)
      return 'bg-gray-400 hover:bg-gray-400 text-gray-800';
    return 'bg-gray-500 hover:bg-gray-500 text-gray-100';
  };

  // Get active media
  const activeMedia = crime?.media[activeMediaIndex];

  // Handle comment submission
  const handleSubmitComment = () => {
    mutate(
      {
        content: newComment,
      },
      {
        onSuccess: () => {
          setNewComment('');
          if (commentInputRef.current) {
            commentInputRef.current.value = '';
          }
        },
      }
    );
  };

  // Navigate media
  const nextMedia = () => {
    if (!crime?.media?.length) return;
    setActiveMediaIndex((prev) => (prev + 1) % crime.media.length);
  };

  const prevMedia = () => {
    if (!crime?.media?.length) return;
    setActiveMediaIndex(
      (prev) => (prev - 1 + crime.media.length) % crime.media.length
    );
  };

  // Get media type display name
  const getMediaTypeName = (type: MediaType) => {
    switch (type) {
      case MediaType.IMAGE:
        return 'Image';
      case MediaType.VIDEO:
        return 'Video';
      default:
        return 'OTHER';
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (!crime) {
    return notFound();
  }

  return (
    <div className='container mx-auto p-4 max-w-5xl mt-10 bg-gray-950'>
      <div className='mb-6'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold'>{crime.title}</h1>
            <div className='flex items-center flex-wrap gap-2 mt-2'>
              <Badge
                className={`${getCrimeTypeColor(crime.crimeType)} font-normal`}
              >
                {crime.crimeType}
              </Badge>
              <Badge
                className={`${getVerificationColor(
                  crime.isVerified
                )} font-normal`}
              >
                {crime.isVerified
                  ? 'Verified'
                  : crime.isVerified === false
                    ? 'Unverified'
                    : 'Pending Verification'}
              </Badge>
              {!crime.isLive && (
                <Badge
                  variant='outline'
                  className='bg-gray-700 text-gray-300 border-gray-600 font-normal'
                >
                  Not Live
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 my-2'>
          <div className='lg:col-span-2 space-y-6'>
            {/* Media Gallery */}
            {crime?.media.length > 0 && (
              <Card className='bg-gray-100 border-gray-200 shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
                <CardHeader className='pb-0'>
                  <h2 className='text-xl font-semibold'>
                    Media ({crime?.media.length})
                  </h2>
                </CardHeader>
                <CardContent className='pt-4'>
                  <div className='relative'>
                    <div className='rounded-lg overflow-hidden border border-gray-300 bg-gray-200 min-h-[300px] flex items-center justify-center dark:border-gray-700 dark:bg-gray-900'>
                      {activeMedia?.type === MediaType.IMAGE && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <img
                              src={activeMedia.url || '/placeholder.svg'}
                              alt={`Media ${activeMediaIndex + 1}`}
                              className='max-h-[400px] object-contain cursor-pointer'
                            />
                          </DialogTrigger>
                          <DialogContent className='max-w-4xl'>
                            <div className='flex justify-between items-center mb-2'>
                              <span className='text-sm text-gray-400'>
                                {getMediaTypeName(activeMedia.type)}{' '}
                                {activeMediaIndex + 1} of {crime?.media.length}
                              </span>
                              <a
                                href={activeMedia.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                              >
                                Open in new tab{' '}
                                <ExternalLink className='ml-1 h-4 w-4' />
                              </a>
                            </div>
                            <img
                              src={activeMedia.url || '/placeholder.svg'}
                              alt={`Media ${activeMediaIndex + 1}`}
                              className='w-full max-h-[80vh] object-contain'
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      {activeMedia?.type === MediaType.VIDEO && (
                        <div className='relative w-full'>
                          <video
                            src={activeMedia.url}
                            controls
                            className='w-full max-h-[400px]'
                          />
                          <a
                            href={activeMedia.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='absolute top-2 right-2 bg-black bg-opacity-70 p-1 rounded-md text-blue-400 hover:text-blue-300'
                          >
                            <ExternalLink className='h-4 w-4' />
                          </a>
                        </div>
                      )}

                      {activeMedia?.type === MediaType.OTHER && (
                        <div className='flex items-center justify-center h-[300px] w-full'>
                          <a
                            href={activeMedia.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex flex-col items-center text-blue-400 hover:text-blue-300'
                          >
                            <ExternalLink className='h-12 w-12 mb-2' />
                            <span>Open Document</span>
                          </a>
                        </div>
                      )}

                      {crime?.media.length > 1 && (
                        <>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full'
                            onClick={prevMedia}
                          >
                            <ChevronLeft className='h-6 w-6' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full'
                            onClick={nextMedia}
                          >
                            <ChevronRight className='h-6 w-6' />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Media Thumbnails */}
                    {crime?.media.length > 1 && (
                      <div className='flex mt-4 space-x-2 overflow-x-auto pb-2'>
                        {crime?.media.map((media, index) => (
                          <button
                            key={media.id}
                            onClick={() => setActiveMediaIndex(index)}
                            className={`flex-shrink-0 h-16 w-16 rounded border-2 overflow-hidden ${
                              index === activeMediaIndex
                                ? 'border-blue-500'
                                : 'border-gray-700'
                            }`}
                          >
                            {media.type === MediaType.IMAGE && (
                              <img
                                src={media.url || '/placeholder.svg'}
                                alt={`Thumbnail ${index + 1}`}
                                className='h-full w-full object-cover'
                              />
                            )}
                            {media.type === MediaType.VIDEO && (
                              <div className='h-full w-full bg-gray-900 flex items-center justify-center'>
                                <Tag className='h-6 w-6 text-gray-400' />
                              </div>
                            )}
                            {media.type === MediaType.OTHER && (
                              <div className='h-full w-full bg-gray-900 flex items-center justify-center'>
                                <ExternalLink className='h-6 w-6 text-gray-400' />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className='bg-gray-100 border-gray-200 shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
              <CardHeader className='pb-0'>
                <h2 className='text-xl font-semibold'>Description</h2>
              </CardHeader>
              <CardContent className='pt-4'>
                <p className='text-gray-700 whitespace-pre-line dark:text-gray-300'>
                  {crime.description}
                </p>

                <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400'>
                  <div>
                    <p className='flex items-center'>
                      <Calendar className='mr-2 h-4 w-4' />
                      <span className='font-semibold mr-2'>
                        Incident Date:
                      </span>{' '}
                      {formatDate(crime.incidentDate)}
                    </p>
                    <p className='flex items-center mt-2'>
                      <Clock className='mr-2 h-4 w-4' />
                      <span className='font-semibold mr-2'>
                        Incident Time:
                      </span>{' '}
                      {formatTime(crime.incidentDate)}
                    </p>
                  </div>
                  <div>
                    <p className='flex items-center'>
                      <MapPin className='mr-2 h-4 w-4' />
                      <span className='font-semibold mr-2'>Location:</span>{' '}
                      {crime.location}
                    </p>
                    <p className='flex items-center mt-2'>
                      <Calendar className='mr-2 h-4 w-4' />
                      <span className='font-semibold mr-2'>Reported:</span>{' '}
                      {formatDateTime(crime.reportedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className='bg-gray-100 border-gray-200 shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
              <CardHeader className='pb-0'>
                <h2 className='text-xl font-semibold'>
                  Comments ({crime.comments.length})
                </h2>
              </CardHeader>
              <CardContent className='pt-4'>
                {/* Comment Form */}
                <div className='mb-6'>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <Textarea
                        ref={commentInputRef}
                        placeholder='Add a comment...'
                        className='w-full resize-none'
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isPending}
                      />
                      <div className='flex justify-end mt-2'>
                        <Button
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim() || isPending}
                          className='bg-gray-700 hover:bg-gray-800 text-white'
                        >
                          {isPending ? 'Posting...' : 'Post Comment'}
                          <Send className='ml-2 h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pinned Comments */}
                {crime.comments.some((comment) => comment.pinned) && (
                  <div className='mb-4'>
                    <h3 className='text-sm font-medium text-gray-400 mb-3'>
                      Pinned Comments
                    </h3>
                    {crime.comments
                      .filter((comment) => comment.pinned)
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className='bg-gray-200 rounded-lg p-4 mb-3 dark:bg-gray-800'
                        >
                          <div className='flex items-start gap-3'>
                            <div className='flex-1'>
                              <div className='flex items-center justify-between'>
                                <div className='text-xs text-gray-400'>
                                  {formatDateTime(comment.createdAt)}
                                </div>
                              </div>
                              <p className='mt-1 text-gray-300'>
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    <Separator className='my-4' />
                  </div>
                )}

                {/* Regular Comments */}
                <div className='space-y-4'>
                  {crime.comments
                    .filter((comment) => !comment.pinned)
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className='border-b border-gray-300 pb-4 last:border-0 dark:border-gray-700'
                      >
                        <div className='flex items-start gap-3'>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between'>
                              <div className='text-xs text-gray-400'>
                                {formatDateTime(comment.createdAt)}
                              </div>
                            </div>
                            <p className='mt-1 text-gray-300'>
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            {/* Location Map */}
            <Card className='bg-gray-100 border-gray-200 shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
              <CardHeader className='pb-0'>
                <h2 className='text-xl font-semibold'>Location</h2>
              </CardHeader>
              <CardContent className='pt-4'>
                <div className='pt-4'>
                  <GoogleMapComponent
                    latitude={crime.latitude}
                    longitude={crime.longitude}
                    location={crime.location}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Crime Details */}
            <Card className='bg-gray-100 border-gray-200 shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
              <CardHeader className='pb-0'>
                <h2 className='text-xl font-semibold'>Crime Details</h2>
              </CardHeader>
              <CardContent className='pt-4'>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Type:</span>
                    <span className='font-medium'>{crime.crimeType}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Status:</span>
                    <span className='font-medium'>
                      {crime.isVerified
                        ? 'Verified'
                        : crime.isVerified === false
                          ? 'Unverified'
                          : 'Pending'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Visibility:</span>
                    <span className='font-medium'>
                      {crime.isLive ? 'Live' : 'Not Live'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Reported:</span>
                    <span className='font-medium'>
                      {formatDate(crime.reportedAt)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Incident Date:</span>
                    <span className='font-medium'>
                      {formatDate(crime.incidentDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className='bg-gray-100 border-gray-200 shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
              <CardContent className='pt-6'>
                <div className='space-y-3'>
                  <Button
                    className='w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                    variant='outline'
                  >
                    <ExternalLink className='mr-2 h-4 w-4' /> Share Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
