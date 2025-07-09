import { createUser, createEvent } from "@/modules/calendar/interfaces";
import { EVENT_COLORS } from "@/modules/calendar/types";

// Lista de usuarios mock
export const USERS_MOCK = [
  createUser({
    id: "f3b035ac-49f7-4e92-a715-35680bf63175",
    name: "Michael Doe",
    picturePath: null,
  }),
  createUser({
    id: "3e36ea6e-78f3-40dd-ab8c-a6c737c3c422",
    name: "Alice Johnson",
    picturePath: null,
  }),
  createUser({
    id: "a7aff6bd-a50a-4d6a-ab57-76f76bb27cf5",
    name: "Robert Smith",
    picturePath: null,
  }),
  createUser({
    id: "dd503cf9-6c38-43cf-94cc-0d4032e2f77a",
    name: "Emily Davis",
    picturePath: null,
  }),
];

// Lista de títulos de eventos posibles
const events = [
  "Doctor's appointment",
  "Dental cleaning",
  "Eye exam",
  "Therapy session",
  "Business meeting",
  "Team stand-up",
  "Project deadline",
  "Weekly report submission",
  "Client presentation",
  "Marketing strategy review",
  "Networking event",
  "Sales call",
  "Investor pitch",
  "Board meeting",
  "Employee training",
  "Performance review",
  "One-on-one meeting",
  "Lunch with a colleague",
  "HR interview",
  "Conference call",
  "Web development sprint planning",
  "Software deployment",
  "Code review",
  "QA testing session",
  "Cybersecurity audit",
  "Server maintenance",
  "API integration update",
  "Data backup",
  "Cloud migration",
  "System upgrade",
  "Content planning session",
  "Product launch",
  "Customer support review",
  "Team building activity",
  "Legal consultation",
  "Budget review",
  "Financial planning session",
  "Tax filing deadline",
  "Investor relations update",
  "Partnership negotiation",
  "Medical check-up",
  "Vaccination appointment",
  "Blood donation",
  "Gym workout",
  "Yoga class",
  "Physical therapy session",
  "Nutrition consultation",
  "Personal trainer session",
  "Parent-teacher meeting",
  "School open house",
  "College application deadline",
  "Final exam",
  "Graduation ceremony",
  "Job interview",
  "Internship orientation",
  "Office relocation",
  "Business trip",
  "Flight departure",
  "Hotel check-in",
  "Vacation planning",
  "Birthday party",
  "Wedding anniversary",
  "Family reunion",
  "Housewarming party",
  "Community volunteer work",
  "Charity fundraiser",
  "Religious service",
  "Concert attendance",
  "Theater play",
  "Movie night",
  "Sporting event",
  "Football match",
  "Basketball game",
  "Tennis practice",
  "Marathon training",
  "Cycling event",
  "Fishing trip",
  "Camping weekend",
  "Hiking expedition",
  "Photography session",
  "Art workshop",
  "Cooking class",
  "Book club meeting",
  "Grocery shopping",
  "Car maintenance",
  "Home renovation meeting",
];

// Función para generar eventos mock
const mockGenerator = (numberOfEvents) => {
  const result = [];
  let currentId = 1;

  const randomUser = USERS_MOCK[Math.floor(Math.random() * USERS_MOCK.length)];

  const now = new Date();
  const startRange = new Date(now);
  startRange.setDate(now.getDate() - 30);
  const endRange = new Date(now);
  endRange.setDate(now.getDate() + 30);

  const currentEvent = createEvent({
    id: currentId++,
    startDate: new Date(now.getTime() - 30 * 60000).toISOString(),
    endDate: new Date(now.getTime() + 30 * 60000).toISOString(),
    title: events[Math.floor(Math.random() * events.length)],
    color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    user: randomUser,
  });

  result.push(currentEvent);

  for (let i = 0; i < numberOfEvents - 1; i++) {
    const isMultiDay = Math.random() < 0.1;

    const startDate = new Date(startRange.getTime() + Math.random() * (endRange.getTime() - startRange.getTime()));
    startDate.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);

    const endDate = new Date(startDate);
    if (isMultiDay) {
      const additionalDays = Math.floor(Math.random() * 4) + 1;
      endDate.setDate(startDate.getDate() + additionalDays);
      endDate.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
    } else {
      endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 3) + 1);
    }

    result.push(
      createEvent({
        id: currentId++,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        title: events[Math.floor(Math.random() * events.length)],
        color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        user: USERS_MOCK[Math.floor(Math.random() * USERS_MOCK.length)],
      })
    );
  }

  return result;
};

// Exporta el arreglo final de eventos mock
export const CALENDAR_ITEMS_MOCK = mockGenerator(80);
