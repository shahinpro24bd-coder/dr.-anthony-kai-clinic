/** Browser-only storage for the admin panel (no server needed). */

export type ContactInfo = {
  doctor: string;
  title: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
};
export type Service = { id: string; name: string; description: string };
export type Faq = { id: string; question: string; answer: string };
export type AppointmentRequest = {
  id: string;
  name: string;
  phone: string;
  date: string;
  message: string;
  page: string;
  createdAt: number;
  read: boolean;
};
export type Account = { username: string; password: string };

export const KEYS = {
  contact: "site_admin_contact_v1",
  services: "site_admin_services_v1",
  faqs: "site_admin_faqs_v1",
  requests: "site_admin_requests_v1",
  account: "site_admin_account_v1",
} as const;

export const DEFAULT_CONTACT: ContactInfo = {
  doctor: "Dr. Anthony El Kai",
  title: "General Practitioner",
  phone: "+961 81 866 011",
  whatsapp: "+961 81 866 011",
  email: "",
  address: "SFEIR Center, Rayfoun, Keserwan, Lebanon",
  hours: "By appointment — walk-ins welcome",
  instagram: "https://www.instagram.com/dr.anthonykai/",
  facebook: "",
};

const SERVICE_NAMES = [
  "General Consultation",
  "Full Health Check-up",
  "At-Home Visits",
  "Emergency Care",
  "Chronic Disease Care",
  "Lab & Imaging Review",
  "Medication Review",
  "Flu & Vaccination",
  "Women's Health & Screening",
  "Lifestyle & Prevention",
  "Wound Care & First Aid",
  "Specialist Referral",
  "Physical Examination",
  "Family Health",
];
export const DEFAULT_SERVICES: Service[] = SERVICE_NAMES.map((name, i) => ({
  id: `s${i + 1}`,
  name,
  description: "",
}));

export const DEFAULT_FAQS: Faq[] = [
  {
    id: "f1",
    question: "How do I book a consultation with Dr. Anthony El Kai?",
    answer: "Call or WhatsApp 81 866 011, or fill in the appointment form. Walk-ins are also welcome depending on availability.",
  },
  {
    id: "f2",
    question: "What happens during the first consultation?",
    answer: "The doctor listens to your concerns, examines you, reviews any previous results and explains the diagnosis and next steps clearly.",
  },
  {
    id: "f3",
    question: "Do you offer home visits?",
    answer: "Yes. At-home visits are available on request for patients who cannot come to the clinic in Rayfoun.",
  },
];

export const DEFAULT_ACCOUNT: Account = { username: "admin", password: "admin123" };

export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}
