import { View, Text } from "react-native";
import React from "react";
import { images } from "../constants";
import { sub } from "date-fns";

export const ExperimentData = [
  {
    id: 1,
    title: "Husky",
    description:
      "Husky is a general name for a sled-type of dog used in northern regions, differentiated from other sled-dog types by their fast pulling style.",
    uploadedImage: [images.husky, images.husky1, images.husky2, images.husky3],
    avatar: images.avatar,
    username: "HuskyLover",
    likes: 100,
    dislikes: 34,
    comments: 96,
  },
  {
    id: 2,
    title: "Golden Retriever",
    description:
      "The Golden Retriever is a medium-large gun dog that retrieves shot waterfowl, such as ducks and upland game birds, during hunting and shooting parties.",
    uploadedImage: [images.goldenretriever],
    avatar: images.avatar1,
    username: "John Doe",
    likes: 82,
    dislikes: 17,
    comments: 69,
  },
  {
    id: 3,
    title: "Pomeranian",
    description:
      "The Pomeranian is a breed of dog of the Spitz type that is named for the Pomerania region in north-west Poland and north-east Germany in Central Europe.",
    uploadedImage: [images.pomeranian],
    avatar: images.avatar2,
    username: "Jane Doe",
    likes: 425,
    dislikes: 81,
    comments: 101,
  },
  {
    id: 4,
    title: "Pomeranian",
    description:
      "The Pomeranian is a breed of dog of the Spitz type that is named for the Pomerania region in north-west Poland and north-east Germany in Central Europe.",
    uploadedImage: [images.pomeranian],
    avatar: images.avatar2,
    username: "Jane Doe",
    likes: 425,
    dislikes: 81,
    comments: 101,
  },
  {
    id: 5,
    title: "Pedigree",
    description:
      "Pedigree is a brand of dog food that is manufactured by Mars, Incorporated. The brand offers a wide variety of different dog food formulas.",
    uploadedImage: [images.dogfood],
    avatar: images.avatar,
    username: "John Brown",
    likes: 2446,
    dislikes: 198,
    comments: 155,
  },
];

export const ItemDummy = [
  {
    id: 1,
    title: "Dog Food",
    price: 200000,
    image: images.dogfood,
    rating: 4.8,
    soldUnits: 100,
    shop: "Pet Shop",
  },
  {
    id: 2,
    title: "Bowl",
    price: 50000,
    image: images.dogbowl,
    rating: 4.5,
    soldUnits: 852,
    shop: "Pet Shop",
  },
  {
    id: 3,
    title: "Dog Leash",
    price: 70000,
    image: images.dogleash,
    rating: 4.0,
    soldUnits: 219,
    shop: "My Puppy Shop",
  },
  {
    id: 4,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 5,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 6,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 7,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 8,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 9,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 10,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 11,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 12,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 13,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 14,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 15,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 16,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 17,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 18,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 19,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 20,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 21,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 22,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 23,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 24,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 25,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 26,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 27,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 28,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 29,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 30,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 31,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 32,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 33,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 34,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 35,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
  {
    id: 36,
    title: "Toy",
    price: 30000,
    image: images.dogtoy,
    rating: 5.0,
    soldUnits: 11000,
    shop: "Animal Kingdom",
  },
];

export const PetDummy = [
  {
    id: 1,
    name: "Chicko",
    image: images.adopt1,
    gender: "Male",
    age: "3 years old",
  },
  {
    id: 2,
    name: "Luna",
    image: images.adopt2,
    gender: "Female",
    age: "2 years old",
  },
  {
    id: 3,
    name: "Borak",
    image: images.adopt3,
    gender: "Male",
    age: "4 years old",
  },
  {
    id: 4,
    name: "Bella",
    image: images.adopt4,
    gender: "Female",
    age: "1 year old",
  },
  {
    id: 5,
    name: "Toby",
    image: images.adopt5,
    gender: "Male",
    age: "6 years old",
  },
  {
    id: 6,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 7,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 8,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 9,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 10,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 11,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 12,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 13,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 14,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
  {
    id: 15,
    name: "Jojo",
    image: images.adopt6,
    gender: "Male",
    age: "8 years old",
  },
];

export const ClinicDummy = [
  {
    id: 1,
    name: "Pet Clinic",
    image: images.clinic1,
    distance: "2.1 km",
    rating: 4.5,
    workingHours: "8:00 AM - 5:00 PM",
    telephone: "0123456789",
  },
  {
    id: 2,
    name: "City Veterinary Hospital",
    image: images.clinic2,
    distance: "3.5 km",
    rating: 4.2,
    workingHours: "9:00 AM - 6:00 PM",
    telephone: "0123456789",
  },
  {
    id: 3,
    name: "Happy Paws Vet Clinic",
    image: images.clinic3,
    distance: "1.8 km",
    rating: 4.7,
    workingHours: "7:00 AM - 4:00 PM",
    telephone: "8832193213",
  },
  {
    id: 4,
    name: "Family Pet Hospital",
    image: images.clinic4,
    distance: "4.2 km",
    rating: 4.0,
    workingHours: "10:00 AM - 7:00 PM",
    telephone: "321356789",
  },
  {
    id: 5,
    name: "Green Valley Veterinary Clinic",
    image: images.clinic5,
    distance: "6.5 km",
    rating: 4.9,
    workingHours: "8:00 AM - 5:00 PM",
    telephone: "321356789",
  },
  {
    id: 6,
    name: "Animal Wellness Clinic",
    image: images.clinic6,
    distance: "2.9 km",
    rating: 4.3,
    workingHours: "9:00 AM - 6:00 PM",
    telephone: "321356789",
  },
  {
    id: 7,
    name: "Best Friends Veterinary Clinic",
    image: images.clinic7,
    distance: "5.7 km",
    rating: 4.6,
    workingHours: "7:00 AM - 4:00 PM",
    telephone: "321356789",
  },
  {
    id: 8,
    name: "Pawfect Pet Care",
    image: images.clinic8,
    distance: "3.3 km",
    rating: 4.8,
    workingHours: "10:00 AM - 7:00 PM",
    telephone: "321356789",
  },
];

export const ProductImages = [
  images.dogfood,
  images.pedigree1,
  images.pedigree2,
  images.pedigree3,
  images.pedigree4,
  images.pedigree5,
];

export const PetImages = [
  images.adopt1,
  images.husky1,
  images.husky2,
  images.husky3,
  images.husky4,
];

export const DoctorDummy = [
  {
    id: 1,
    name: "Dr. John Doe",
    image: images.doctor1,
    age: "35 years old",
    gender: "male",
    experience: "10 years experience",
    speciality: "Veterinarian",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Dr. Sarah Smith",
    image: images.doctor2,
    age: "42 years old",
    gender: "female",
    experience: "15 years experience",
    speciality: "Cardiologist",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Dr. Michael Johnson",
    image: images.doctor3,
    age: "55 years old",
    gender: "male",
    experience: "20+ years experience",
    speciality: "Neurologist",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Dr. Emily Williams",
    image: images.doctor4,
    age: "38 years old",
    gender: "female",
    experience: "12 years experience",
    speciality: "Pediatrician",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Dr. Alex Rodriguez",
    image: images.doctor5,
    age: "48 years old",
    gender: "male",
    experience: "18 years experience",
    speciality: "General Surgeon",
    rating: 4.6,
  },
];

export const CommentDummy = [
  {
    id: 1,
    userId: "user123",
    userAvatar: images.avatar1,
    userName: "Jane Smith",
    comment: "This is great! I really enjoyed this article.",
    subcomment: [
      {
        id: 101,
        commentId: 1, // Sub-comment under comment id 1
        userId: "user456", // Michael Johnson replying
        userName: "Michael Johnson",
        comment: "I agree, Jane! It was a really insightful read.",
        userAvatar: images.avatar1,
      },
      {
        id: 102,
        commentId: 3, // Sub-comment under comment id 3
        userId: "user123", // Jane Smith replying
        userName: "Jane Smith",
        comment:
          "I can try to answer your question, Emily. What specifically are you wondering about?I can try to answer your question, Emily. What specifically are you wondering about?I can try to answer your question, Emily. What specifically are you wondering about?I can try to answer your question, Emily. What specifically are you wondering about?",
        userAvatar: images.avatar2,
      },
      {
        id: 103,
        commentId: 4, // Sub-comment under comment id 4
        userId: "user789", // Emily Davis replying
        userName: "Emily Davis",
        comment: "Right?! I was so impressed.",
        userAvatar: images.avatar3,
      },
      {
        id: 104,
        commentId: 5, // Sub-comment under comment id 5
        userId: "user101", // David Wilson replying
        userName: "David Wilson",
        comment: "Me too, Olivia! It really resonated with me.",
        userAvatar: images.avatar4,
      },
      {
        id: 105,
        commentId: 6, // Sub-comment under comment id 5
        userId: "user101", // David Wilson replying
        userName: "Harry Maguaire",
        comment: "Me too, Olivia! It really resonated with me.",
        userAvatar: images.avatar5,
      },
      {
        id: 106,
        commentId: 7, // Sub-comment under comment id 5
        userId: "user101", // David Wilson replying
        userName: "John Cina",
        comment: "GGWP. I really like this article",
        userAvatar: images.avatar6,
      },
      {
        id: 107,
        commentId: 8, // Sub-comment under comment id 5
        userId: "user101", // David Wilson replying
        userName: "Alex Lock",
        comment: "Wow this is amazing",
        userAvatar: images.avatar7,
      },
    ],
  },
  {
    id: 2,
    userId: "user456",
    userAvatar: images.avatar2,
    userName: "Michael Johnson",
    comment: "Thanks for sharing this information. It's very helpful.",
    subcomment: [],
  },
  {
    id: 3,
    userId: "user789",
    userAvatar: images.avatar3,
    userName: "Emily Davis",
    comment: "I have a question about this topic. Can someone clarify?",
    subcomment: [],
  },
  {
    id: 4,
    userId: "user101",
    userAvatar: images.avatar5,
    userName: "David Wilson",
    comment: "Wow, this is amazing!",
    subcomment: [],
  },
  {
    id: 5,
    userId: "user112",
    userAvatar: images.avatar4,
    userName: "Olivia Brown",
    comment: "I completely agree with this point of view.",
    subcomment: [],
  },
];

export const UserDummy = [
  {
    id: 1,
    name: "John Doe",
    username: "john_doe",
    email: "john.doe@example.com",
    address: "123 Main St, Springfield, IL 62701",
    age: 28,
    gender: "Male",
    avatar: images.avatar1,
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "jane_smith",
    email: "jane.smith@example.com",
    address: "456 Elm St, Metropolis, NY 10001",
    age: 34,
    gender: "Female",
    avatar: images.avatar2,
  },
  {
    id: 3,
    name: "Mike Jones",
    username: "mike_jones",
    email: "mike.jones@example.com",
    address: "789 Oak St, Gotham, NJ 07001",
    age: 22,
    gender: "Male",
    avatar: images.avatar3,
  },
  {
    id: 4,
    name: "Alice Brown",
    username: "alice_brown",
    email: "alice.brown@example.com",
    address: "101 Maple St, Star City, CA 90001",
    age: 29,
    gender: "Female",
    avatar: images.avatar4,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    username: "charlie_wilson",
    email: "charlie.wilson@example.com",
    address: "202 Pine St, Central City, TX 73301",
    age: 41,
    gender: "Male",
    avatar: images.avatar5,
  },
  {
    id: 6,
    name: "Emily Davis",
    username: "emily_davis",
    email: "emily.davis@example.com",
    address: "303 Cedar St, Coast City, FL 32004",
    age: 25,
    gender: "Female",
    avatar: images.avatar6,
  },
  {
    id: 7,
    name: "David Miller",
    username: "david_miller",
    email: "david.miller@example.com",
    address: "404 Birch St, Keystone City, PA 17001",
    age: 37,
    gender: "Male",
    avatar: images.avatar7,
  },
  {
    id: 8,
    name: "Susan Taylor",
    username: "susan_taylor",
    email: "susan.taylor@example.com",
    address: "505 Walnut St, Hub City, WA 98001",
    age: 30,
    gender: "Female",
    avatar: images.avatar8,
  },
  {
    id: 9,
    name: "Robert Lee",
    username: "robert_lee",
    email: "robert.lee@example.com",
    address: "606 Aspen St, Smallville, KS 67001",
    age: 45,
    gender: "Male",
    avatar: images.avatar9,
  },
  {
    id: 10,
    name: "Linda Clark",
    username: "linda_clark",
    email: "linda.clark@example.com",
    address: "707 Fir St, Fawcett City, OH 43001",
    age: 32,
    gender: "Female",
    avatar: images.avatar10,
  },
  {
    id: 11,
    name: "John Brown",
    username: "john_brown123",
    email: "john.brown@example.com",
    address: "123 Main St, Los Angeles, IL 62701",
    age: 28,
    gender: "Male",
    avatar: images.avatar,
  },
];

export const PetVaccinationHistoryDummy = [
  { date: "April 10, 2021", vaccine: "DHPP", notes: "First dose" },
  { date: "May 15, 2021", vaccine: "DHPP", notes: "Second dose" },
  { date: "June 20, 2021", vaccine: "Rabies", notes: "Initial vaccination" },
  { date: "April 15, 2022", vaccine: "DHPP", notes: "Annual booster" },
  { date: "June 18, 2022", vaccine: "Rabies", notes: "Annual booster" },
  { date: "April 20, 2023", vaccine: "DHPP", notes: "Annual booster" },
  { date: "June 15, 2023", vaccine: "Rabies", notes: "Annual booster" },
];

export const PetMedicalHistoryDummy = [
  {
    date: "July 5, 2021",
    reason: "Lameness (right hind leg)",
    diagnosis: "Mild sprain",
    treatment: "Rest, anti-inflammatory meds",
    notes: "Full recovery within a week",
  },
  {
    date: "Feb 12, 2022",
    reason: "Annual wellness exam",
    diagnosis: "Healthy",
    treatment: "Routine vaccinations",
    notes: "Heartworm test negative",
  },
  {
    date: "Sept 8, 2022",
    reason: "Vomiting, lethargy",
    diagnosis: "Gastroenteritis",
    treatment: "Anti-nausea meds, fluids",
    notes: "Suspected dietary indiscretion",
  },
  {
    date: "April 3, 2023",
    reason: "Ear infection (both ears)",
    diagnosis: "Otitis externa",
    treatment: "Ear cleaning, topical meds",
    notes: "Responded well to treatment",
  },
  {
    date: "June 25, 2023",
    reason: "Skin allergies",
    diagnosis: "Atopic dermatitis",
    treatment: "Antihistamines, medicated shampoo",
    notes: "Ongoing management with allergy-friendly diet",
  },
];

export const VetAppointmentsDummy = [
  {
    appointmentId: "A001",
    petName: "Max",
    ownerName: "John Smith",
    date: "2024-05-22",
    time: "10:30 AM",
    reasonForVisit: "Annual checkup & vaccinations",
    vetAssigned: "Dr. Lee",
    notes: "Up-to-date on rabies, needs flea treatment",
    vetClinic: "Friendly Paws Clinic",
    telephone: "0123456789",
  },
  {
    appointmentId: "A002",
    petName: "Bella",
    ownerName: "Jane Doe",
    date: "2024-05-23",
    time: "2:00 PM",
    reasonForVisit: "Lameness (right hind leg)",
    vetAssigned: "Dr. Nguyen",
    notes: "Possible sprain, X-ray scheduled",
    vetClinic: "Animal Care Center",
    telephone: "0123456789",
  },
  {
    appointmentId: "A003",
    petName: "Charlie",
    ownerName: "Emily Brown",
    date: "2024-05-24",
    time: "9:00 AM",
    reasonForVisit: "Ear infection",
    vetAssigned: "Dr. Lee",
    notes: "Culture taken, medication prescribed",
    vetClinic: "City Vet Clinic",
    telephone: "0123456789",
  },
  {
    appointmentId: "A004",
    petName: "Lucy",
    ownerName: "Mark Davis",
    date: "2024-05-28",
    time: "4:30 PM",
    reasonForVisit: "Dental cleaning",
    vetAssigned: "Dr. Patel",
    notes: "Requires pre-anesthetic bloodwork",
    vetClinic: "Friendly Paws Clinic",
    telephone: "0123456789",
  },
  {
    appointmentId: "A005",
    petName: "Buddy",
    ownerName: "Sarah Jones",
    date: "2024-05-30",
    time: "11:00 AM",
    reasonForVisit: "Follow-up (post-surgery recheck)",
    vetAssigned: "Dr. Nguyen",
    notes: "Incision healing well",
    vetClinic: "Animal Care Center",
    telephone: "0123456789",
  },
  {
    appointmentId: "A006",
    petName: "Daisy",
    ownerName: "Peter Lee",
    date: "2024-06-01",
    time: "3:15 PM",
    reasonForVisit: "Skin allergy consult",
    vetAssigned: "Dr. Patel",
    notes: "Allergy testing recommended",
    vetClinic: "Friendly Paws Clinic",
    telephone: "0123456789",
  },
  {
    appointmentId: "A007",
    petName: "Oliver",
    ownerName: "Maria Garcia",
    date: "2024-06-03",
    time: "8:45 AM",
    reasonForVisit: "New puppy wellness exam",
    vetAssigned: "Dr. Lee",
    notes: "First round of vaccines given",
    vetClinic: "City Vet Clinic",
    telephone: "0123456789",
  },
];

export const CategoryDummy = [
  {
    id: 1,
    name: "Food & Treats",
  },
  {
    id: 2,
    name: "Health & Wellness",
  },
  {
    id: 3,
    name: "Toys & Entertainment",
  },
  {
    id: 4,
    name: "Housing & Travel",
  },
  {
    id: 5,
    name: "Accessories & Apparel",
  },
  {
    id: 6,
    name: "Cleaning & Waste Management",
  },
  {
    id: 7,
    name: "Aquatics & Small Animals",
  },
];

export const OrdersDummy = [
  // First order (same as before)
  {
    orderId: "SHOPEE123456789",
    orderDate: "2024-05-28",
    customer: {
      name: "John Doe",
      address: "123 Main Street, Da Nang, Vietnam",
      phone: "+84 123 456 789",
      email: "johndoe@email.com",
    },
    items: [
      {
        id: 1,
        name: "Dog Food",
        price: 200000,
        image: images.dogfood,
        rating: 4.8,
        soldUnits: 100,
        shop: "Pet Shop",
        quantity: 2,
      },
      {
        id: 2,
        name: "Bowl",
        price: 50000,
        image: images.dogbowl,
        rating: 4.5,
        soldUnits: 852,
        shop: "Pet Shop",
        quantity: 1,
      },
    ],
    subtotal: 950000,
    shippingFee: 50000,
    discount: 20000,
    total: 980000,
    paymentMethod: "Credit Card (Visa ending in 1234)",
    status: "Processing",
    notes: "Please ensure all items are in stock before shipping.",
    estimatedDeliveryDate: "2024-06-02",
  },

  {
    orderId: "SHOPEE987654321",
    orderDate: "2024-05-26",
    customer: {
      name: "Jane Smith",
      address: "456 Elm Street, Ho Chi Minh City, Vietnam",
      phone: "+84 987 654 321",
      email: "janesmith@email.com",
    },
    items: [
      {
        id: 1,
        name: "Dog Food",
        price: 200000,
        image: images.dogfood,
        rating: 4.8,
        soldUnits: 100,
        shop: "Pet Shop",
        quantity: 2,
      },
      {
        id: 2,
        name: "Bowl",
        price: 50000,
        image: images.dogbowl,
        rating: 4.5,
        soldUnits: 852,
        shop: "Pet Shop",
        quantity: 1,
      },
    ],
    subtotal: 1130000,
    shippingFee: 45000,
    discount: 0,
    total: 1175000,
    paymentMethod: "Cash on Delivery",
    status: "Delivered",
    notes: "",
    estimatedDeliveryDate: "2024-05-29",
  },

  {
    orderId: "SHOPEE555555555",
    orderDate: "2024-05-22",
    customer: {
      name: "Michael Johnson",
      address: "789 Oak Avenue, Hanoi, Vietnam",
      phone: "+84 555 555 555",
      email: "michaeljohnson@email.com",
    },
    items: [
      {
        id: 1,
        name: "Dog Food",
        price: 200000,
        image: images.dogfood,
        rating: 4.8,
        soldUnits: 100,
        shop: "Pet Shop",
        quantity: 2,
      },
      {
        id: 2,
        name: "Bowl",
        price: 50000,
        image: images.dogbowl,
        rating: 4.5,
        soldUnits: 852,
        shop: "Pet Shop",
        quantity: 1,
      },
    ],
    subtotal: 530000,
    shippingFee: 30000,
    discount: 10000,
    total: 550000,
    paymentMethod: "ShopeePay",
    status: "Shipped",
    notes: "Fragile items, handle with care.",
    estimatedDeliveryDate: "2024-05-25",
  },
];

export const ProductReviewDummy = [
  {
    id: 1,
    userName: "Jane Smith",
    userAvatar: images.avatar1,
    review:
      "This product exceeded my expectations! Excellent quality and value.",
    rating: 5,
    createdTime: "2024-05-28T08:15:00", // 2 days ago
  },
  {
    id: 2,
    userName: "Michael Johnson",
    userAvatar: images.avatar2,
    review:
      "I've been using this for a week now, and it's working great. Highly recommend.",
    rating: 4,
    createdTime: "2024-05-29T14:30:00", // Yesterday
  },
  {
    id: 3,
    userName: "Emily Davis",
    userAvatar: images.avatar3,
    review: "Good product, but the instructions could be clearer.",
    rating: 3,
    createdTime: "2024-05-30T09:45:00", // Today
  },
  {
    id: 4,
    userName: "David Wilson",
    userAvatar: images.avatar4,
    review: "Love the sleek design! It's a perfect fit for my needs.",
    rating: 5,
    createdTime: "2024-05-25T16:20:00", // 5 days ago
  },
  {
    id: 5,
    userName: "Olivia Brown",
    userAvatar: images.avatar5,
    review: "Worth every penny.  I would definitely buy this again.",
    rating: 5,
    createdTime: "2024-05-26T12:00:00", // 4 days ago
  },
];
