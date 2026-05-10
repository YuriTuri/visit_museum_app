export type Ticket = {
  id: string;
  label: string;
  sub?: string;
  price: number;
};

export type Exhibition = {
  id: string;
  title: string;
  museum: string;
  dates: string;
  image: string;
  tags: string[];
  description: string;
  address: string;
  station: string;
  hours: { label: string; value: string }[];
  tickets: Ticket[];
  area: string;
  schedule: string;
  ageGroup: "family-friendly" | "adults-only" | "all";
};

const SEED_IMG = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=600&q=70`;

export const exhibitions: Exhibition[] = [
  {
    id: "boundaries",
    title: "Boundaries of the Unknown: Contemporary Art Exhibition",
    museum: "Museum of Contemporary Art Tokyo",
    dates: "July 1 - Aug 31",
    image: SEED_IMG("photo-1577720580479-7d839d829c73"),
    tags: ["Art", "Contemporary", "Creative"],
    area: "Shibuya",
    schedule: "Now Showing",
    ageGroup: "adults-only",
    description:
      'Discover the profound shifts in modern expression at "Boundaries of the Unknown." This exhibition brings together groundbreaking works that challenge our perception of reality through bold abstract forms and innovative multimedia installations. Experience a journey where art meets the edge of the unexplored.',
    address: "4-1-1 Miyoshi, Koto-city, Tokyo 135-0022",
    station:
      "9-minute walk from Kiyosumi-shirakawa Station (Hanzomon Line / Oedo Line)",
    hours: [
      { label: "Tuesday - Thursday", value: "10:00 - 18:00" },
      { label: "Friday - Saturday", value: "10:00 - 20:00" },
      { label: "Sunday & Holidays", value: "10:00 - 17:00" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 2200 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 1400,
      },
      { id: "junior", label: "Junior High / Elementary", price: 800 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 1500 },
    ],
  },
  {
    id: "edo",
    title: "The Spirit of Edo: Katsushika Hokusai Masterpieces",
    museum: "Edo-Tokyo Museum",
    dates: "June 15 - Sept 10",
    image: SEED_IMG("photo-1582555172866-f73bb12a2ab3"),
    tags: ["History", "Ukiyoe", "Edo"],
    area: "Asakusa",
    schedule: "Now Showing",
    ageGroup: "all",
    description:
      "An unprecedented gathering of Hokusai's most iconic works alongside rare prints from private collections. Step into the spirit of Edo through landscapes, waves, and everyday life rendered by Japan's most celebrated ukiyo-e master.",
    address: "1-4-1 Yokoami, Sumida City, Tokyo 130-0015",
    station: "3-minute walk from Ryogoku Station (JR Sobu Line / Oedo Line)",
    hours: [
      { label: "Tuesday - Sunday", value: "09:30 - 17:30" },
      { label: "Saturday", value: "09:30 - 19:30" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 1800 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 1100,
      },
      { id: "junior", label: "Junior High / Elementary", price: 600 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 1300 },
    ],
  },
  {
    id: "space",
    title: "Voyage to Deep Space: NASA Photography Exhibition",
    museum: "National Museum of Nature and Science",
    dates: "Open All Year",
    image: SEED_IMG("photo-1446776877081-d282a0f896e2"),
    tags: ["Science", "Space", "Photography"],
    area: "Ueno",
    schedule: "Now Showing",
    ageGroup: "family-friendly",
    description:
      "From the rings of Saturn to the dust of distant nebulae, this immersive exhibition presents NASA's most breathtaking photographs alongside interactive installations exploring our place in the cosmos.",
    address: "7-20 Ueno Park, Taito City, Tokyo 110-8718",
    station: "5-minute walk from Ueno Station (JR Lines)",
    hours: [
      { label: "Tuesday - Sunday", value: "09:00 - 17:00" },
      { label: "Friday & Saturday", value: "09:00 - 20:00" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 1600 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 1000,
      },
      { id: "junior", label: "Junior High / Elementary", price: 500 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 1100 },
    ],
  },
  {
    id: "impressionism",
    title: "Painters of Light: The Legacy of Impressionism",
    museum: "The National Museum of Western Art",
    dates: "Aug 10 - Oct 5",
    image: SEED_IMG("photo-1541961017774-22349e4a1262"),
    tags: ["FineArt", "Impressionist", "Classic"],
    area: "Ginza",
    schedule: "Coming Soon",
    ageGroup: "all",
    description:
      "A luminous survey of late 19th-century painting tracing the radical shift toward light, color, and the everyday — featuring loans from museums across Europe.",
    address: "7-7 Ueno Park, Taito City, Tokyo 110-0007",
    station: "1-minute walk from Ueno Station (Park exit)",
    hours: [
      { label: "Tuesday - Sunday", value: "09:30 - 17:30" },
      { label: "Friday & Saturday", value: "09:30 - 20:00" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 2000 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 1300,
      },
      { id: "junior", label: "Junior High / Elementary", price: 700 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 1400 },
    ],
  },
  {
    id: "dinosaur",
    title: "The New Dinosaur Continent: Cretaceous Ecosystems",
    museum: "National Museum of Nature and Science",
    dates: "July 20 - Sept 30",
    image: SEED_IMG("photo-1606856110002-d0991ce78250"),
    tags: ["Science", "Dinosaur", "Family"],
    area: "Ueno",
    schedule: "Coming Soon",
    ageGroup: "family-friendly",
    description:
      "Newly excavated fossils, full-scale skeletons, and life-sized recreations bring the Cretaceous period to life. A family-friendly journey through 80 million years of dinosaur evolution.",
    address: "7-20 Ueno Park, Taito City, Tokyo 110-8718",
    station: "5-minute walk from Ueno Station (JR Lines)",
    hours: [
      { label: "Tuesday - Sunday", value: "09:00 - 17:00" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 1900 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 1200,
      },
      { id: "junior", label: "Junior High / Elementary", price: 600 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 1300 },
    ],
  },
  {
    id: "city",
    title: "Memories of the City: 100 Years Through Architecture",
    museum: "Tokyo Photographic Art Museum",
    dates: "Sept 1 - Nov 15",
    image: SEED_IMG("photo-1486325212027-8081e485255e"),
    tags: ["Photo", "Architecture", "Urban"],
    area: "Ebisu",
    schedule: "Coming Soon",
    ageGroup: "all",
    description:
      "A century of Tokyo seen through the lens of its buildings — from Meiji-era brick to postwar concrete to the glass towers of today.",
    address: "1-13-3 Mita, Meguro City, Tokyo 153-0062",
    station: "7-minute walk from Ebisu Station",
    hours: [
      { label: "Tuesday - Sunday", value: "10:00 - 18:00" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 1500 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 900,
      },
      { id: "junior", label: "Junior High / Elementary", price: 500 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 1000 },
    ],
  },
  {
    id: "ceramics",
    title: "The Breath of Earth: New Waves in Ceramic Art",
    museum: "National Museum of Modern Art, Crafts Gallery",
    dates: "June 1 - July 15",
    image: SEED_IMG("photo-1578749556568-bc2c40e68b61"),
    tags: ["Craft", "Ceramics", "Modern"],
    area: "Roppongi",
    schedule: "Ending Soon",
    ageGroup: "all",
    description:
      "Contemporary ceramicists redefine the medium — sculptural forms, wood-fired surfaces, and quiet meditations on earth and time.",
    address: "1-1 Kitanomaru Park, Chiyoda City, Tokyo 102-8322",
    station: "8-minute walk from Takebashi Station",
    hours: [
      { label: "Tuesday - Sunday", value: "10:00 - 17:00" },
      { label: "Friday", value: "10:00 - 20:00" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 1400 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 800,
      },
      { id: "junior", label: "Junior High / Elementary", price: 400 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 900 },
    ],
  },
  {
    id: "insects",
    title: "Wonders of the Insect World: Evolution of Beauty",
    museum: "National Museum of Nature and Science",
    dates: "July 13 - Oct 1",
    image: SEED_IMG("photo-1561622539-fb88d3bd5c0a"),
    tags: ["Nature", "Insects", "Education"],
    area: "Ueno",
    schedule: "Now Showing",
    ageGroup: "family-friendly",
    description:
      "Iridescent beetles, geometric butterflies, and microscopic marvels — an exploration of how 350 million years of evolution shaped some of nature's most stunning designs.",
    address: "7-20 Ueno Park, Taito City, Tokyo 110-8718",
    station: "5-minute walk from Ueno Station (JR Lines)",
    hours: [
      { label: "Tuesday - Sunday", value: "09:00 - 17:00" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 1700 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 1100,
      },
      { id: "junior", label: "Junior High / Elementary", price: 500 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 1200 },
    ],
  },
  {
    id: "picturebook",
    title: "Picture Books Around the World: Originals & Stories",
    museum: "Chihiro Art Museum",
    dates: "Aug 1 - Nov 30",
    image: SEED_IMG("photo-1512820790803-83ca734da794"),
    tags: ["Illustration", "PictureBook", "Family"],
    area: "Shinjuku",
    schedule: "Coming Soon",
    ageGroup: "family-friendly",
    description:
      "Original artwork from beloved picture books across five continents, paired with the personal letters and sketches of their authors.",
    address: "4-7-2 Shimoshakujii, Nerima City, Tokyo 177-0042",
    station: "7-minute walk from Kami-igusa Station",
    hours: [
      { label: "Tuesday - Sunday", value: "10:00 - 17:00" },
      { label: "Monday", value: "Closed" },
    ],
    tickets: [
      { id: "adult", label: "Adult", price: 1200 },
      {
        id: "student",
        label: "Student",
        sub: "(University/High School)",
        price: 800,
      },
      { id: "junior", label: "Junior High / Elementary", price: 400 },
      { id: "senior", label: "Seniors", sub: "(65+)", price: 900 },
    ],
  },
];

export function findExhibition(id: string | undefined): Exhibition | undefined {
  return exhibitions.find((e) => e.id === id);
}

export const popularIds = [
  "impressionism",
  "dinosaur",
  "city",
  "ceramics",
  "insects",
  "picturebook",
];
export const allResultIds = ["boundaries", "edo", "space"];
