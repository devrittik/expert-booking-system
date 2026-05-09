require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");

const Expert = require("./models/Expert");
const Booking = require("./models/Booking");

const formatDate = (date) => date.toISOString().split("T")[0];
const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
};

const categories = [
    "Technology",
    "Finance",
    "Health",
    "Legal",
    "Marketing",
    "Career",
    "Education",
    "Business",
    "Design",
    "Fitness",
];

const firstNames = [
    "Aarav",
    "Vivaan",
    "Aditya",
    "Rohan",
    "Karan",
    "Ishaan",
    "Meera",
    "Ananya",
    "Priya",
    "Sana",
    "Ayesha",
    "Neha",
    "Kavya",
    "Rahul",
    "Vikram",
    "Arjun",
    "Simran",
    "Dev",
    "Riya",
    "Nikhil",
];

const lastNames = [
    "Sharma",
    "Mehta",
    "Rajan",
    "Nair",
    "Joshi",
    "Kapoor",
    "Iyer",
    "Desai",
    "Malhotra",
    "Bose",
    "Chatterjee",
    "Agarwal",
    "Reddy",
    "Khanna",
    "Saxena",
];

const bios = {
    Technology:
        "Full-stack engineer helping startups scale modern applications.",
    Finance:
        "Financial consultant specializing in investments and wealth planning.",
    Health:
        "Certified wellness expert focused on balanced and healthy living.",
    Legal:
        "Legal advisor experienced in contracts and business compliance.",
    Marketing:
        "Growth strategist helping brands improve visibility and conversions.",
    Career:
        "Career mentor guiding professionals through job and interview prep.",
    Education:
        "Academic coach focused on effective learning and productivity.",
    Business:
        "Business consultant helping founders validate and grow ideas.",
    Design:
        "Product designer focused on intuitive user experiences.",
    Fitness:
        "Fitness coach helping clients build sustainable routines.",
};

const slotTimes = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomSlots = () => {
    const shuffled = [...slotTimes].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 3).map((time) => ({
        time,
    }));
};

const createSlotGroups = () => {
    const numberOfDays = Math.floor(Math.random() * 3) + 1;
    const dayOffsets = new Set();

    while (dayOffsets.size < numberOfDays) {
        dayOffsets.add(Math.floor(Math.random() * 7) + 1);
    }

    return Array.from(dayOffsets)
        .sort((left, right) => left - right)
        .map((offset) => ({
            date: addDays(offset),
            timeSlots: getRandomSlots(),
        }));
};

const experts = Array.from({ length: 195 }, (_, index) => {
    const category = categories[index % categories.length];

    return {
        name: `${getRandom(firstNames)} ${getRandom(lastNames)}`,
        category,
        experience: Math.floor(Math.random() * 16) + 5,
        rating: Number((Math.random() * 1 + 4).toFixed(1)),
        bio: bios[category],
        slots: createSlotGroups(),
    };
});

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await Booking.deleteMany({});
    await Expert.deleteMany({});
    await Expert.insertMany(experts);
    console.log(`Seeded ${experts.length} experts`);
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
