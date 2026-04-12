// constants.ts
interface NavLinks {
    label: string;
    href: string;
}
export const NavLinks: NavLinks[] = [
  { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

interface Steps {
  step: number;
  title: string;
  description: string;
}

export interface Medicine {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category: string;
  manufacturer: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";
export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export const Steps: Steps[] = [
  {
    step: 1,
    title: "Choose Your Medicine",
    description: "Browse our catalog and select the medicines you need.",
  },
  {
    step: 2,
    title: "Place Your Order",
    description:
      "Add to cart, checkout, and confirm delivery details.",
  },
  {
    step: 3,
    title: "Fast Home Delivery",
    description:
      "Receive your medicines safely at your doorstep.",
  },
];

interface Review {
  name: string;
  feedback: string;
  img: string;
}

export const reviewsData: Review[] = [
  {
    name: "Ayesha Rahman",
    feedback:
      "Fast delivery and authentic medicines! I love the convenience of ordering online from MediStore.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Tanvir Hossain",
    feedback:
      "Great customer service and very reliable. I always get my orders on time.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sabrina Khan",
    feedback:
      "The website is super easy to use, and the delivery is very quick. Highly recommend MediStore!",
    img: "https://randomuser.me/api/portraits/women/45.jpg",
  },
];

interface QuickLinks {
  label: string;
  href: string;
}
export const QuickLinks: QuickLinks[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Login", href: "/login" },
]


export const categories = [
  "Pain Relief",
  "Antibiotics",
  "Vitamins",
  "Diabetes",
  "Others"
];
export const manufacturers = [
  "Square",
  "Beximco",
  "Incepta",
  "ACI",
  "Others"
];
export const priceRanges = [
  { label: "Below ৳100", min: 0, max: 100 },
  { label: "৳100 - ৳300", min: 100, max: 300 },
  { label: "Above ৳300", min: 300, max: Infinity },
];

export interface SessionResult {
  data: {
    user: {
      id: string;
      role: "ADMIN" | "SELLER" | "CUSTOMER";
      email?: string;
    };
  } | null;
  error: unknown | null;
}
