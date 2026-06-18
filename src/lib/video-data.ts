export type Video = {
  id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  thumbnail: string;
  views: string;
  duration: string;
  uploadedAt: string;
  category: string;
  description: string;
  tags: string[];
  likes: number;
  dislikes: number;
};

export const CATEGORIES = [
  "All",
  "Gaming",
  "Cooking",
  "Technology",
  "Fitness",
  "Music",
  "Travel",
  "Science",
  "Comedy",
  "Sports",
];

export const VIDEOS: Video[] = [
  {
    id: "1",
    title: "Ultimate Gaming Setup Tour 2024 - Budget to Beast",
    channel: "TechGamer Pro",
    channelAvatar: "TG",
    thumbnail:
      "https://images.unsplash.com/photo-1560419398-c36ab8c174b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "2.4M",
    duration: "18:32",
    uploadedAt: "3 days ago",
    category: "Gaming",
    description:
      "In this video, we go through the ultimate gaming setup from budget options all the way to a full beast rig. Everything you need to dominate.",
    tags: ["gaming", "setup", "pc"],
    likes: 94000,
    dislikes: 1200,
  },
  {
    id: "2",
    title: "Perfect Pasta Carbonara Recipe - Better Than Any Restaurant",
    channel: "Chef Marco Kitchen",
    channelAvatar: "CM",
    thumbnail:
      "https://images.unsplash.com/photo-1672590311138-20daa4fcdfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "1.1M",
    duration: "12:07",
    uploadedAt: "1 week ago",
    category: "Cooking",
    description:
      "Learn how to make an authentic pasta carbonara that beats any restaurant version. Simple ingredients, amazing results.",
    tags: ["cooking", "pasta", "italian"],
    likes: 55000,
    dislikes: 430,
  },
  {
    id: "3",
    title: "Top 10 Tech Gadgets You NEED in 2024",
    channel: "GadgetWorld",
    channelAvatar: "GW",
    thumbnail:
      "https://images.unsplash.com/photo-1716637644831-e046c73be197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "876K",
    duration: "22:14",
    uploadedAt: "5 days ago",
    category: "Technology",
    description:
      "We review the top 10 must-have tech gadgets of 2024. From smart home devices to cutting edge wearables.",
    tags: ["tech", "gadgets", "review"],
    likes: 38000,
    dislikes: 900,
  },
  {
    id: "4",
    title: "30-Day Transformation: Full Body Workout Plan",
    channel: "FitLife Daily",
    channelAvatar: "FL",
    thumbnail:
      "https://images.unsplash.com/photo-1630065612874-b0c19e95d30c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "3.2M",
    duration: "35:48",
    uploadedAt: "2 weeks ago",
    category: "Fitness",
    description:
      "Follow this complete 30-day transformation workout plan. No equipment needed, just dedication and consistency.",
    tags: ["fitness", "workout", "transformation"],
    likes: 142000,
    dislikes: 2100,
  },
  {
    id: "5",
    title: "Live Concert Highlights - Rock Fest 2024",
    channel: "MusicVibes",
    channelAvatar: "MV",
    thumbnail:
      "https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "560K",
    duration: "48:20",
    uploadedAt: "4 days ago",
    category: "Music",
    description:
      "Incredible highlights from the Rock Fest 2024 live concert. Experience the energy and atmosphere of the biggest rock event of the year.",
    tags: ["music", "concert", "rock"],
    likes: 28000,
    dislikes: 320,
  },
  {
    id: "6",
    title: "PS5 vs Xbox Series X - Which Should YOU Buy?",
    channel: "TechGamer Pro",
    channelAvatar: "TG",
    thumbnail:
      "https://images.unsplash.com/photo-1577271606670-33b128e7898c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "4.8M",
    duration: "25:02",
    uploadedAt: "1 month ago",
    category: "Gaming",
    description:
      "The ultimate console showdown. We compare every aspect of PS5 vs Xbox Series X to help you decide which one is worth your money.",
    tags: ["gaming", "ps5", "xbox"],
    likes: 210000,
    dislikes: 8400,
  },
  {
    id: "7",
    title: "Baking Sourdough Bread From Scratch - Beginner's Guide",
    channel: "HomeChef Hannah",
    channelAvatar: "HH",
    thumbnail:
      "https://images.unsplash.com/photo-1611727940880-e8cdf6c8ce95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "720K",
    duration: "29:15",
    uploadedAt: "2 days ago",
    category: "Cooking",
    description:
      "Complete beginner's guide to baking perfect sourdough bread at home. Starter, fermentation, and baking tips all covered.",
    tags: ["cooking", "baking", "bread"],
    likes: 41000,
    dislikes: 290,
  },
  {
    id: "8",
    title: "I Built a $10,000 PC - Was It Worth It?",
    channel: "GadgetWorld",
    channelAvatar: "GW",
    thumbnail:
      "https://images.unsplash.com/photo-1758159234917-0c76ccd29051?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "1.9M",
    duration: "31:44",
    uploadedAt: "3 weeks ago",
    category: "Technology",
    description:
      "We spent $10,000 building the ultimate PC. Benchmarks, thermal performance, and whether it's actually worth the insane price tag.",
    tags: ["tech", "pc", "build"],
    likes: 88000,
    dislikes: 3200,
  },
  {
    id: "9",
    title: "Guitar Fingerpicking Masterclass for Beginners",
    channel: "MusicVibes",
    channelAvatar: "MV",
    thumbnail:
      "https://images.unsplash.com/photo-1545538331-78f76ca06830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "430K",
    duration: "41:05",
    uploadedAt: "1 week ago",
    category: "Music",
    description:
      "Master the art of fingerpicking guitar with this comprehensive beginner tutorial. Covers patterns, timing, and classic songs.",
    tags: ["music", "guitar", "tutorial"],
    likes: 22000,
    dislikes: 180,
  },
  {
    id: "10",
    title: "6-Pack Abs in 8 Weeks - Science-Based Program",
    channel: "FitLife Daily",
    channelAvatar: "FL",
    thumbnail:
      "https://images.unsplash.com/photo-1600026453249-24a43274d65a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "5.6M",
    duration: "19:38",
    uploadedAt: "2 months ago",
    category: "Fitness",
    description:
      "The science-backed 8-week program to build visible abs. Nutrition, training, and recovery all explained in detail.",
    tags: ["fitness", "abs", "workout"],
    likes: 247000,
    dislikes: 4500,
  },
  {
    id: "11",
    title: "Elden Ring - All Hidden Secrets Revealed",
    channel: "TechGamer Pro",
    channelAvatar: "TG",
    thumbnail:
      "https://images.unsplash.com/photo-1698064534597-e039edaa0717?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "3.1M",
    duration: "52:11",
    uploadedAt: "5 months ago",
    category: "Gaming",
    description:
      "Every hidden secret, easter egg, and lore detail in Elden Ring. A deep dive into FromSoftware's masterpiece.",
    tags: ["gaming", "eldenring", "secrets"],
    likes: 178000,
    dislikes: 1900,
  },
  {
    id: "12",
    title: "Sushi Making at Home - Pro Chef Techniques",
    channel: "Chef Marco Kitchen",
    channelAvatar: "CM",
    thumbnail:
      "https://images.unsplash.com/photo-1628711594843-e420787a3afa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
    views: "890K",
    duration: "27:33",
    uploadedAt: "10 days ago",
    category: "Cooking",
    description:
      "Learn to make restaurant-quality sushi at home with professional chef techniques. Rice, fish selection, and rolling covered.",
    tags: ["cooking", "sushi", "japanese"],
    likes: 63000,
    dislikes: 510,
  },
];
