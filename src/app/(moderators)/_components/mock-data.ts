import type { Crime } from "./crime-table";

// Define the CrimeType enum directly in this file to avoid import issues
enum CrimeType {
  HOMICIDE = "HOMICIDE",
  ASSAULT = "ASSAULT",
  THEFT = "THEFT",
  ROBBERY = "ROBBERY",
  BURGLARY = "BURGLARY",
  ARSON = "ARSON",
  VANDALISM = "VANDALISM",
  FRAUD = "FRAUD",
  EMBEZZLEMENT = "EMBEZZLEMENT",
  KIDNAPPING = "KIDNAPPING",
  CYBERCRIME = "CYBERCRIME",
  DRUG_TRAFFICKING = "DRUG_TRAFFICKING",
  RAPE = "RAPE",
}

// Generate mock data for the crime table
export const mockCrimes: Crime[] = [
  {
    id: "1",
    userId: "user1",
    title: "Convenience Store Robbery",
    description:
      "Armed robbery at a 24-hour convenience store on Main Street. The suspect was wearing a black hoodie and mask.",
    location: "123 Main Street, Downtown",
    latitude: 40.7128,
    longitude: -74.006,
    placeId: "place1",
    reportedAt: new Date("2023-04-15T08:30:00"),
    crimeType: "ROBBERY" as any,
    incidentDate: new Date("2023-04-15T02:15:00"),
    isLive: true,
    isVerified: true,
    createdAt: new Date("2023-04-15T08:30:00"),
    updatedAt: new Date("2023-04-15T10:45:00"),
    media: [
      {
        id: "media1",
        url: "/placeholder.svg?height=300&width=400",
        type: "IMAGE",
        crimeId: "1",
        uploadedAt: new Date("2023-04-15T08:35:00"),
      },
      {
        id: "media2",
        url: "/placeholder.svg?height=300&width=400",
        type: "IMAGE",
        crimeId: "1",
        uploadedAt: new Date("2023-04-15T08:40:00"),
      },
    ],
    comments: [
      {
        id: "comment1",
        content:
          "I saw this happen. The suspect fled in a blue sedan heading east.",
        userId: "user2",
        crimeId: "1",
        createdAt: new Date("2023-04-15T09:00:00"),
        pinned: true,
        user: {
          name: "John Doe",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "comment2",
        content:
          "Police were on the scene within 5 minutes. They're reviewing security footage.",
        userId: "user3",
        crimeId: "1",
        createdAt: new Date("2023-04-15T09:15:00"),
        pinned: false,
        user: {
          name: "Jane Smith",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
    votes: [
      {
        id: "vote1",
        userId: "user2",
        crimeId: "1",
        value: true,
        createdAt: new Date("2023-04-15T09:05:00"),
      },
    ],
  },
  {
    id: "2",
    userId: "user4",
    title: "Vehicle Break-in at Shopping Mall",
    description:
      "Multiple vehicles were broken into at the Westfield Shopping Mall parking lot. Items stolen include laptops, purses, and other valuables.",
    location: "Westfield Shopping Mall, 456 Retail Drive",
    latitude: 40.7282,
    longitude: -74.0776,
    placeId: "place2",
    reportedAt: new Date("2023-04-16T14:20:00"),
    crimeType: "THEFT" as any,
    incidentDate: new Date("2023-04-16T13:00:00"),
    isLive: true,
    isVerified: false,
    createdAt: new Date("2023-04-16T14:20:00"),
    updatedAt: new Date("2023-04-16T15:30:00"),
    media: [
      {
        id: "media3",
        url: "/placeholder.svg?height=300&width=400",
        type: "IMAGE",
        crimeId: "2",
        uploadedAt: new Date("2023-04-16T14:25:00"),
      },
      {
        id: "media4",
        url: "/placeholder.svg?height=300&width=400",
        type: "VIDEO",
        crimeId: "2",
        uploadedAt: new Date("2023-04-16T14:30:00"),
      },
    ],
    comments: [
      {
        id: "comment3",
        content:
          "My car was one of those broken into. They took my laptop and bag.",
        userId: "user5",
        crimeId: "2",
        createdAt: new Date("2023-04-16T14:45:00"),
        pinned: false,
        user: {
          name: "Robert Johnson",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
    votes: [
      {
        id: "vote2",
        userId: "user5",
        crimeId: "2",
        value: true,
        createdAt: new Date("2023-04-16T14:50:00"),
      },
    ],
  },
  {
    id: "3",
    userId: "user6",
    title: "Residential Burglary",
    description:
      "Home broken into while residents were on vacation. Jewelry, electronics, and cash were stolen.",
    location: "789 Oak Street, Suburbia",
    latitude: 40.7411,
    longitude: -74.0266,
    placeId: "place3",
    reportedAt: new Date("2023-04-17T10:15:00"),
    crimeType: "BURGLARY" as any,
    incidentDate: new Date("2023-04-16T22:00:00"),
    isLive: true,
    isVerified: true,
    createdAt: new Date("2023-04-17T10:15:00"),
    updatedAt: new Date("2023-04-17T11:30:00"),
    media: [
      {
        id: "media5",
        url: "/placeholder.svg?height=300&width=400",
        type: "IMAGE",
        crimeId: "3",
        uploadedAt: new Date("2023-04-17T10:20:00"),
      },
    ],
    comments: [
      {
        id: "comment4",
        content:
          "I'm a neighbor and noticed suspicious activity around 10 PM. A white van was parked outside for about an hour.",
        userId: "user7",
        crimeId: "3",
        createdAt: new Date("2023-04-17T10:45:00"),
        pinned: true,
        user: {
          name: "Emily Wilson",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "comment5",
        content:
          "This is the third break-in on this street in the last month. We need increased patrols.",
        userId: "user8",
        crimeId: "3",
        createdAt: new Date("2023-04-17T11:00:00"),
        pinned: false,
        user: {
          name: "Michael Brown",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
    votes: [
      {
        id: "vote3",
        userId: "user7",
        crimeId: "3",
        value: true,
        createdAt: new Date("2023-04-17T10:50:00"),
      },
    ],
  },
  {
    id: "4",
    userId: "user9",
    title: "Vandalism at City Park",
    description:
      "Graffiti and property damage at Central City Park. Several benches and playground equipment were damaged.",
    location: "Central City Park, Downtown",
    latitude: 40.758,
    longitude: -73.9855,
    placeId: "place4",
    reportedAt: new Date("2023-04-18T07:45:00"),
    crimeType: "VANDALISM" as any,
    incidentDate: new Date("2023-04-17T23:30:00"),
    isLive: true,
    isVerified: false,
    createdAt: new Date("2023-04-18T07:45:00"),
    updatedAt: new Date("2023-04-18T08:30:00"),
    media: [
      {
        id: "media6",
        url: "/placeholder.svg?height=300&width=400",
        type: "IMAGE",
        crimeId: "4",
        uploadedAt: new Date("2023-04-18T07:50:00"),
      },
      {
        id: "media7",
        url: "/placeholder.svg?height=300&width=400",
        type: "IMAGE",
        crimeId: "4",
        uploadedAt: new Date("2023-04-18T07:55:00"),
      },
    ],
    comments: [
      {
        id: "comment6",
        content:
          "I was walking my dog early this morning and saw the damage. It's really disappointing.",
        userId: "user10",
        crimeId: "4",
        createdAt: new Date("2023-04-18T08:15:00"),
        pinned: false,
        user: {
          name: "Sarah Thompson",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
    votes: [
      {
        id: "vote4",
        userId: "user10",
        crimeId: "4",
        value: true,
        createdAt: new Date("2023-04-18T08:20:00"),
      },
    ],
  },
  {
    id: "5",
    userId: "user11",
    title: "Credit Card Fraud",
    description:
      "Multiple reports of unauthorized credit card charges from people who recently dined at Gourmet Restaurant.",
    location: "Gourmet Restaurant, 321 Culinary Lane",
    latitude: 40.7429,
    longitude: -74.0085,
    placeId: "place5",
    reportedAt: new Date("2023-04-19T16:30:00"),
    crimeType: "FRAUD" as any,
    incidentDate: new Date("2023-04-15T00:00:00"),
    isLive: true,
    isVerified: true,
    createdAt: new Date("2023-04-19T16:30:00"),
    updatedAt: new Date("2023-04-19T17:45:00"),
    media: [],
    comments: [
      {
        id: "comment7",
        content:
          "I found unauthorized charges on my card after eating there last weekend. Already reported to my bank.",
        userId: "user12",
        crimeId: "5",
        createdAt: new Date("2023-04-19T16:45:00"),
        pinned: false,
        user: {
          name: "David Miller",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "comment8",
        content:
          "Same thing happened to me! Three charges for online purchases I never made.",
        userId: "user13",
        crimeId: "5",
        createdAt: new Date("2023-04-19T17:00:00"),
        pinned: false,
        user: {
          name: "Lisa Garcia",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "comment9",
        content:
          "The restaurant management is aware and working with authorities. They believe it was a staff member who has since been terminated.",
        userId: "user14",
        crimeId: "5",
        createdAt: new Date("2023-04-19T17:30:00"),
        pinned: true,
        user: {
          name: "Officer James Wilson",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
    votes: [
      {
        id: "vote5",
        userId: "user12",
        crimeId: "5",
        value: true,
        createdAt: new Date("2023-04-19T16:50:00"),
      },
      {
        id: "vote6",
        userId: "user13",
        crimeId: "5",
        value: true,
        createdAt: new Date("2023-04-19T17:05:00"),
      },
    ],
  },
];
