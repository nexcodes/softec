// 'use client';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Calendar, ImageIcon, MapPin, MessageSquare } from 'lucide-react';
// import { useState } from 'react';
// import type { Crime } from './crime-table';

// interface CrimeDetailDialogProps {
//   crime: Crime;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function CrimeDetailDialog({
//   crime,
//   open,
//   onOpenChange,
// }: CrimeDetailDialogProps) {
//   const [activeTab, setActiveTab] = useState('comments');

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
//         <DialogHeader>
//           <DialogTitle className='text-xl'>{crime.title}</DialogTitle>
//         </DialogHeader>

//         <div className='mt-4 space-y-4'>
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <div>
//               <h3 className='text-sm font-medium text-muted-foreground mb-1'>
//                 Description
//               </h3>
//               <p className='text-sm'>{crime.description}</p>
//             </div>

//             <div className='space-y-2'>
//               <div className='flex items-center gap-2'>
//                 <MapPin className='h-4 w-4 text-muted-foreground' />
//                 <span className='text-sm'>{crime.location}</span>
//               </div>

//               <div className='flex items-center gap-2'>
//                 <Calendar className='h-4 w-4 text-muted-foreground' />
//                 <span className='text-sm'>
//                   {crime.incidentDate.toLocaleDateString()}
//                 </span>
//               </div>

//               <div className='flex items-center gap-2'>
//                 <Badge variant='outline' className='capitalize'>
//                   {crime.crimeType.replace('_', ' ').toLowerCase()}
//                 </Badge>

//                 {crime.isLive && (
//                   <Badge
//                     variant='default'
//                     className='bg-green-500 hover:bg-green-600'
//                   >
//                     Live
//                   </Badge>
//                 )}

//                 {crime.isVerified && (
//                   <Badge
//                     variant='default'
//                     className='bg-blue-500 hover:bg-blue-600'
//                   >
//                     Verified
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </div>

//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className='w-full'
//           >
//             <TabsList className='grid w-full grid-cols-2'>
//               <TabsTrigger value='comments' className='flex items-center gap-2'>
//                 <MessageSquare className='h-4 w-4' />
//                 Comments ({crime.comments.length})
//               </TabsTrigger>
//               <TabsTrigger value='media' className='flex items-center gap-2'>
//                 <ImageIcon className='h-4 w-4' />
//                 Media ({crime.media.length})
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value='comments' className='mt-4 space-y-4'>
//               {crime.comments.length > 0 ? (
//                 crime.comments.map((comment) => (
//                   <div key={comment.id} className='p-4 border rounded-lg'>
//                     <div className='flex items-start gap-3'>
//                       <Avatar className='h-8 w-8'>
//                         <AvatarImage
//                           src={comment.user?.image || ''}
//                           alt={comment.user?.name || 'User'}
//                         />
//                         <AvatarFallback>
//                           {comment.user?.name?.[0] || 'U'}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className='flex-1'>
//                         <div className='flex items-center justify-between'>
//                           <p className='text-sm font-medium'>
//                             {comment.user?.name || 'Anonymous'}
//                           </p>
//                           <span className='text-xs text-muted-foreground'>
//                             {comment.createdAt.toLocaleDateString()}
//                           </span>
//                         </div>
//                         <p className='text-sm mt-1'>{comment.content}</p>
//                       </div>
//                     </div>
//                     {comment.pinned && (
//                       <Badge variant='secondary' className='mt-2'>
//                         Pinned
//                       </Badge>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p className='text-center text-muted-foreground py-8'>
//                   No comments yet
//                 </p>
//               )}
//             </TabsContent>

//             <TabsContent value='media' className='mt-4'>
//               {crime.media.length > 0 ? (
//                 <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
//                   {crime.media.map((media) => (
//                     <div
//                       key={media.id}
//                       className='border rounded-lg overflow-hidden'
//                     >
//                       {media.type === 'IMAGE' ? (
//                         <img
//                           src={media.url || '/placeholder.svg'}
//                           alt='Crime evidence'
//                           className='w-full h-48 object-cover'
//                         />
//                       ) : media.type === 'VIDEO' ? (
//                         <video
//                           src={media.url}
//                           controls
//                           className='w-full h-48 object-cover'
//                         />
//                       ) : (
//                         <div className='w-full h-48 flex items-center justify-center bg-muted'>
//                           <p className='text-sm text-muted-foreground'>
//                             File: {media.url.split('/').pop()}
//                           </p>
//                         </div>
//                       )}
//                       <div className='p-2'>
//                         <p className='text-xs text-muted-foreground'>
//                           {media.uploadedAt.toLocaleDateString()}
//                         </p>
//                         <Badge variant='outline' className='mt-1'>
//                           {media.type}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className='text-center text-muted-foreground py-8'>
//                   No media available
//                 </p>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
