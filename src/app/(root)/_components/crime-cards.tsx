"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DateToString } from "@/types/helper";
import { Crime, CrimeType, Media } from "@prisma/client";
import { Calendar, Clock, ExternalLink, Eye, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type CrimeCardProps = {
  crime: DateToString<Crime> & {
    media?: DateToString<Media>[];
  };
  onViewCrime: (id: string) => void;
};

const CrimeCard = ({ crime, onViewCrime }: CrimeCardProps) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Format date and time
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get crime type badge color
  const getCrimeTypeColor = (type: CrimeType) => {
    switch (type) {
      case CrimeType.HOMICIDE:
        return "bg-red-800 hover:bg-red-700 text-white";
      case CrimeType.ASSAULT:
        return "bg-red-600 hover:bg-red-500 text-white";
      case CrimeType.THEFT:
        return "bg-amber-600 hover:bg-amber-500 text-white";
      case CrimeType.ROBBERY:
        return "bg-amber-700 hover:bg-amber-600 text-white";
      case CrimeType.BURGLARY:
        return "bg-amber-800 hover:bg-amber-700 text-white";
      case CrimeType.ARSON:
        return "bg-orange-700 hover:bg-orange-600 text-white";
      case CrimeType.VANDALISM:
        return "bg-orange-500 hover:bg-orange-400 text-white";
      case CrimeType.FRAUD:
        return "bg-purple-600 hover:bg-purple-500 text-white";
      case CrimeType.EMBEZZLEMENT:
        return "bg-purple-700 hover:bg-purple-600 text-white";
      case CrimeType.KIDNAPPING:
        return "bg-blue-800 hover:bg-blue-700 text-white";
      case CrimeType.CYBERCRIME:
        return "bg-cyan-600 hover:bg-cyan-500 text-white";
      case CrimeType.DRUG_TRAFFICKING:
        return "bg-green-700 hover:bg-green-600 text-white";
      case CrimeType.RAPE:
        return "bg-pink-800 hover:bg-pink-700 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-400 text-white";
    }
  };

  // Get verification status badge color
  const getVerificationColor = (isVerified: boolean | undefined | null) => {
    if (isVerified === true) return "bg-green-600 hover:bg-green-600";
    if (isVerified === false) return "bg-red-600 hover:bg-red-600";
    return "bg-gray-600 hover:bg-gray-600";
  };

  // Get active media
  const activeMedia = crime?.media?.[activeMediaIndex];

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg overflow-hidden">
      <CardHeader className="p-6 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3
              onClick={() => onViewCrime(crime.id)}
              className="text-xl font-bold mb-1 cursor-pointer"
            >
              {crime.title}
            </h3>

            <div className="flex items-center flex-wrap gap-2">
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
                  ? "Verified"
                  : crime.isVerified === false
                  ? "Unverified"
                  : "Pending Verification"}
              </Badge>

              {!crime.isLive && (
                <Badge
                  variant="outline"
                  className="bg-gray-700 text-gray-300 border-gray-600 font-normal"
                >
                  Not Live
                </Badge>
              )}

              <span className="text-gray-400 text-xs flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {crime.location}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Media Gallery */}
        {crime.media && crime.media.length > 0 && (
          <div className="mb-4">
            <div
              className={cn(
                "rounded-lg overflow-hidden border border-gray-700 relative",
                activeMedia?.type === "IMAGE" && "pt-[56.25%]"
              )}
            >
              {activeMedia?.type === "IMAGE" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Image
                      src={activeMedia.url || "/placeholder.svg"}
                      className="w-full h-64 object-cover cursor-pointer"
                      fill
                      alt=""
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="flex justify-between items-center mb-2">
                      <a
                        href={activeMedia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300"
                      >
                        Open in new tab{" "}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                    <Image
                      src={activeMedia.url || "/placeholder.svg"}
                      className="w-full max-h-[80vh] object-contain"
                      width={100}
                      height={100}
                      alt=""
                    />
                  </DialogContent>
                </Dialog>
              )}

              {activeMedia?.type === "VIDEO" && (
                <div className="relative">
                  <video
                    src={activeMedia.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={activeMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 bg-black bg-opacity-70 p-1 rounded-md text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {activeMedia?.type === "OTHER" && (
                <div className="flex items-center justify-center h-64 bg-gray-900">
                  <a
                    href={activeMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-12 w-12 mb-2" />
                  </a>
                </div>
              )}
            </div>

            {/* Media Thumbnails */}
            {crime.media && crime.media.length > 0 && (
              <div className="flex mt-2 space-x-2 overflow-x-auto pb-2">
                {crime.media.map((media, index) => (
                  <button
                    key={media.id}
                    onClick={() => setActiveMediaIndex(index)}
                    className={`flex-shrink-0 h-16 w-16 rounded border-2 overflow-hidden ${
                      index === activeMediaIndex
                        ? "border-blue-500"
                        : "border-gray-700"
                    }`}
                  >
                    {media.type === "IMAGE" && (
                      <Image
                        src={media.url || "/placeholder.svg"}
                        className="h-full w-full object-cover"
                        width={100}
                        height={100}
                        alt=""
                      />
                    )}
                    {media.type === "VIDEO" && (
                      <div className="h-full w-full bg-gray-900 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    {media.type === "OTHER" && (
                      <div className="h-full w-full bg-gray-900 flex items-center justify-center">
                        <ExternalLink className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Crime Description */}
        <p className="text-gray-300">{crime.description}</p>

        <div className="flex items-center text-gray-400 text-sm space-x-4">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(new Date(crime.incidentDate))}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {formatTime(new Date(crime.incidentDate))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrimeCard;
