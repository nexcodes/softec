"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createCrimeSchema } from "@/schema";
import { CrimeType } from "@prisma/client";
import { MediaUpload } from "./media-upload";

import { Label } from "@radix-ui/react-menubar";

import { useCreateMedia } from "@/app/(main)/_api/use-create-media";
import { useStyledAutocomplete } from "@/hooks/use-styled-autocomplete";
import { useEdgeStore } from "@/lib/edgestore";
import { client } from "@/lib/hono";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import React from "react";

const crimeFormSchema = createCrimeSchema;

type CrimeFormValues = z.infer<typeof crimeFormSchema>;

export default function CrimeReportPage() {
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();

  const [autocomplete, setAutocomplete] =
    React.useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.formatted_address) {
        form.setValue("location", place.formatted_address);

        if (place.geometry && place.geometry.location) {
          form.setValue("latitude", place.geometry.location.lat());
          form.setValue("longitude", place.geometry.location.lng());
          form.setValue("placeId", place.place_id);
        }
      }
    }
  };

  const [isPending, startTransition] = useTransition();
  const { mutate: uploadMedia } = useCreateMedia();
  const { edgestore } = useEdgeStore();

  const form = useForm<CrimeFormValues>({
    resolver: zodResolver(crimeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      crimeType: undefined,
    },
  });

  function onSubmit(values: CrimeFormValues) {
    startTransition(async () => {
      const response = await client.api.crime.$post({
        json: values,
      });

      if (!response.ok) {
        return;
      }

      const { data } = await response.json();

      files.forEach(async (file) => {
        const uploadedFile = await edgestore.publicFiles.upload({ file });

        // Check if the file is an image based on MIME type
        const fileType = file.type.startsWith("image/")
          ? "IMAGE"
          : file.type.startsWith("video/")
          ? "VIDEO"
          : "OTHER";

        const mediaData = {
          url: uploadedFile.url,
          type: fileType as "IMAGE" | "VIDEO" | "OTHER",
          crimeId: data.id,
        };

        uploadMedia(mediaData, {
          onSuccess: () => {
            console.log("Media uploaded successfully!");
          },
          onError: (error) => {
            console.error("Error uploading media:", error);
          },
        });
      });

      router.push("/report");
    });
  }

  useStyledAutocomplete();

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Report a Crime</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief title of the incident"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Provide a clear, concise title for this incident.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of what happened"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Describe the incident in detail, including any relevant
                    information.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <LoadScript
                  googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
                  libraries={["places"]}
                >
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">
                          Location
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Autocomplete
                              onLoad={onLoad}
                              onPlaceChanged={onPlaceChanged}
                              options={{
                                types: ["address"],
                                fields: [
                                  "formatted_address",
                                  "geometry",
                                  "place_id",
                                ],
                              }}
                            >
                              <Input
                                {...field}
                                placeholder="Address or location name"
                                className="bg-gray-800 border-gray-700 text-white pl-10"
                                disabled={isPending}
                              />
                            </Autocomplete>
                            <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </LoadScript>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="crimeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">
                        Crime Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full">
                            <SelectValue placeholder="Select crime type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {Object.keys(CrimeType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="incidentDate"
              render={({ field }) => {
                // Get time from the date or use default
                const hours = field.value
                  ? field.value.getHours().toString().padStart(2, "0")
                  : "12";
                const minutes = field.value
                  ? field.value.getMinutes().toString().padStart(2, "0")
                  : "00";
                const seconds = field.value
                  ? field.value.getSeconds().toString().padStart(2, "0")
                  : "00";
                const defaultTime = `${hours}:${minutes}:${seconds}`;

                // Handle time change
                interface TimeChangeEvent
                  extends React.ChangeEvent<HTMLInputElement> {
                  target: HTMLInputElement;
                }

                const handleTimeChange = (e: TimeChangeEvent): void => {
                  const timeValue = e.target.value;
                  if (!timeValue || !field.value) return;

                  const [hours, minutes, seconds] = timeValue
                    .split(":")
                    .map(Number);
                  const newDate = new Date(field.value);
                  newDate.setHours(hours);
                  newDate.setMinutes(minutes);
                  newDate.setSeconds(seconds || 0);
                  field.onChange(newDate);
                };

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-200">
                      Date of Incident
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isPending}
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-gray-800 border-gray-700 text-white",
                              !field.value && "text-gray-400"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p") // Added "p" to also display time
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-gray-800 border-gray-700"
                        align="start"
                      >
                        <div className="rounded-md border">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              // Preserve time when changing date
                              if (date && field.value) {
                                const newDate = new Date(date);
                                newDate.setHours(field.value.getHours());
                                newDate.setMinutes(field.value.getMinutes());
                                newDate.setSeconds(field.value.getSeconds());
                                field.onChange(newDate);
                              } else {
                                field.onChange(date);
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className="bg-gray-800 text-white"
                          />
                          <div className="border-t p-3">
                            <div className="flex items-center gap-3">
                              <Label className="text-xs">Enter time</Label>
                              <div className="relative grow">
                                <Input
                                  type="time"
                                  step="1"
                                  value={field.value ? defaultTime : "12:00:00"}
                                  onChange={handleTimeChange}
                                  className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                  <ClockIcon size={16} aria-hidden="true" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                );
              }}
            />

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-200">
                Upload Evidence
              </h3>
              <p className="text-sm text-gray-400">
                Upload photos or videos related to the incident (optional).
              </p>
              <MediaUpload
                disabled={isPending}
                files={files}
                setFiles={setFiles}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isPending}
            >
              Submit Report
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
