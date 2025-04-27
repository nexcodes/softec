'use client';

import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface MediaUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  disabled: boolean;
}

export function MediaUpload({ files, setFiles, disabled }: MediaUploadProps) {
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      className='w-full'
      value={files}
      onValueChange={setFiles}
      onFileReject={onFileReject}
      multiple
      disabled={disabled}
    >
      <FileUploadDropzone className='bg-gray-800 border-gray-700'>
        <div className='flex flex-col items-center gap-1'>
          <div className='flex items-center justify-center rounded-full border border-gray-700 p-2.5'>
            <Upload className='size-6 text-gray-400' />
          </div>
          <p className='font-medium text-sm text-gray-200'>
            Drag & drop files here
          </p>
          <p className='text-gray-400 text-xs'>Or click to browse</p>
        </div>
        <FileUploadTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='mt-2 w-fit bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
          >
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList className='bg-gray-800 border-gray-700 rounded-md mt-2'>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} className='border-gray-700'>
            <FileUploadItemPreview />
            <FileUploadItemMetadata className='text-gray-200' />
            <FileUploadItemDelete asChild>
              <Button
                variant='ghost'
                size='icon'
                className='size-7 text-gray-400 hover:text-gray-200'
              >
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
