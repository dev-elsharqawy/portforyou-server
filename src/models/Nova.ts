import mongoose, { Schema, Document } from "mongoose";
import {
  INovaProject,
  INovaSkill,
  INovaTestimonial,
  INovaContact,
  INovaHero,
  ITemplateAnalytics,
} from "../lib/types/template.types";
import { VisitorSchema } from "./Visitor";

export interface INova extends Document {
  hero: INovaHero;
  skills: INovaSkill[];
  projects: INovaProject[];
  testimonials: INovaTestimonial[];
  contact: INovaContact;
  analytics: ITemplateAnalytics;
}

const NovaProjectSchema = new Schema<INovaProject>({
  id: String,
  title: String,
  description: String,
  image: String,
  image_id: String,
  tags: [String],
  link: String,
});

const NovaSkillSchema = new Schema<INovaSkill>({
  id: String,
  name: String,
  percentage: Number,
});

const NovaTestimonialSchema = new Schema<INovaTestimonial>({
  id: String,
  name: String,
  position: String,
  company: String,
  text: String,
  avatar: String,
  avatar_id: String,
});

const NovaContactSchema = new Schema<INovaContact>({
  heading: String,
  subheading: String,
  email: String,
  phone: String,
  address: String,
  social_links: [
    {
      name: String,
      url: String,
      icon: String,
    },
  ],
});

export const NovaSchema = new Schema<INova>({
  hero: {
    heading: {
      type: String,
      default: "Hi, I'm Nova Creative",
    },
    subheading: {
      type: String,
      default: "Designer & Developer crafting beautiful digital experiences",
    },
    description: {
      type: String,
      default: "I specialize in creating stunning, functional websites and applications that help businesses and individuals stand out in the digital landscape. With a focus on clean design and seamless user experience, I bring ideas to life.",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    },
    image_id: {
      type: String,
      default: "",
    },
  },
  skills: {
    type: [NovaSkillSchema],
    default: [
      { id: "1", name: "React", percentage: 90 },
      { id: "2", name: "TypeScript", percentage: 85 },
      { id: "3", name: "Node.js", percentage: 80 },
      { id: "4", name: "Next.js", percentage: 85 },
      { id: "5", name: "GraphQL", percentage: 75 },
      { id: "6", name: "UI/UX Design", percentage: 70 },
      { id: "7", name: "MongoDB", percentage: 75 },
      { id: "8", name: "TailwindCSS", percentage: 90 },
    ],
  },
  projects: {
    type: [NovaProjectSchema],
    default: [
      {
        id: "1",
        title: "Modern E-commerce Platform",
        description: "A fully responsive e-commerce platform built with Next.js, featuring product filtering, cart functionality, and secure payment processing.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        image_id: "",
        tags: ["Next.js", "React", "Tailwind CSS", "Stripe"],
        link: "https://example.com/project1",
      },
      {
        id: "2",
        title: "Portfolio Dashboard",
        description: "An interactive dashboard for tracking portfolio performance with real-time data visualization and analytics.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        image_id: "",
        tags: ["React", "D3.js", "TypeScript", "Firebase"],
        link: "https://example.com/project2",
      },
      {
        id: "3",
        title: "Mobile Fitness App",
        description: "A cross-platform fitness application with workout tracking, nutrition planning, and progress visualization.",
        image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        image_id: "",
        tags: ["React Native", "Redux", "Node.js", "MongoDB"],
        link: "https://example.com/project3",
      },
      {
        id: "4",
        title: "AI Content Generator",
        description: "An AI-powered content generation tool that creates high-quality articles, social media posts, and marketing copy.",
        image: "https://images.unsplash.com/photo-1677442135133-4da243c2f9e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
        image_id: "",
        tags: ["Python", "TensorFlow", "GPT-3", "FastAPI"],
        link: "https://example.com/project4",
      },
    ],
  },
  testimonials: {
    type: [NovaTestimonialSchema],
    default: [
      {
        id: "1",
        name: "Sarah Johnson",
        position: "CEO",
        company: "TechVision",
        text: "Working with Nova was an absolute pleasure. They delivered our project on time and exceeded our expectations with their attention to detail and creative solutions.",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        avatar_id: "",
      },
      {
        id: "2",
        name: "Michael Chen",
        position: "Marketing Director",
        company: "GrowthLabs",
        text: "Nova transformed our digital presence with a stunning website that perfectly captures our brand identity. Their technical expertise and design skills are top-notch.",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        avatar_id: "",
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        position: "Founder",
        company: "Artisan Studio",
        text: "I was impressed by Nova's ability to understand our vision and translate it into a beautiful, functional website. They were responsive, professional, and a joy to work with.",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        avatar_id: "",
      },
    ],
  },
  contact: {
    type: NovaContactSchema,
    default: {
      heading: "Get in Touch",
      subheading: "Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you.",
      email: "hello@novacreative.com",
      phone: "+1 (555) 123-4567",
      address: "123 Creative St, Design City, CA 94103",
      social_links: [
        {
          name: "GitHub",
          url: "https://github.com/novacreative",
          icon: "github",
        },
        {
          name: "LinkedIn",
          url: "https://linkedin.com/in/novacreative",
          icon: "linkedin",
        },
        {
          name: "Twitter",
          url: "https://twitter.com/novacreative",
          icon: "twitter",
        },
        {
          name: "Instagram",
          url: "https://instagram.com/novacreative",
          icon: "instagram",
        },
      ],
    },
  },
  analytics: {
    type: {
      visitors: {
        type: [VisitorSchema],
        default: [],
      },
      totalVisits: {
        type: Number,
        default: 0,
      },
    },
    default: {
      visitors: [],
      totalVisits: 0,
    },
  },
});
