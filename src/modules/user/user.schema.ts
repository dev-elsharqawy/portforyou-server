import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type TestimonialClient {
    client_img_url: String
    client_img_id: String
    client_name: String
    client_company: String
  }

  type ArikTestimonial {
    testimonial_heading: String
    testimonial_paragraph: String
    testimonial_client: TestimonialClient
  }

  type ArikProcessStep {
    step_heading: String
    step_subheading: String
    step_paragraph: String
    step_points: [String]
  }

  type ArikProcess {
    process_heading: String
    process_paragraph: String
    steps: [ArikProcessStep]
  }

  type ArikService {
    title: String
    description: String
  }

  type ArikHero {
    hero_heading: String
    hero_subheading: String
    hero_paragraph: String
  }

  type ArikTestimonials {
    testimonials_heading: String
    testimonials_paragraph: String
    testimonials: [ArikTestimonial]
  }

  type ArikFooter {
    footer_heading: String
    footer_paragraph: String
  }

  type ArikLogos {
    img_url: String
    img_id: String
  }

  type ArikWorkExperience {
    id: String
    project_link: String
    title: String
    category: String
    img_url: String
    img_id: String
  }

  type Visitor {
    ip: String!
    country: String!
    browser: String!
    device: String!
    visitDate: String!
  }

  type TemplateAnalytics {
    visitors: [Visitor!]!
    totalVisits: Int!
  }

  type Arik {
    hero: ArikHero
    logos: [ArikLogos]
    services: [ArikService]
    work: [ArikWorkExperience]
    process: ArikProcess
    testimonials: ArikTestimonials
    footer: ArikFooter
    analytics: TemplateAnalytics
  }

  # Nova Template Types
  type NovaSocialLink {
    name: String
    url: String
    icon: String
  }

  type NovaContact {
    heading: String
    subheading: String
    email: String
    phone: String
    address: String
    social_links: [NovaSocialLink]
  }

  type NovaSkill {
    id: String
    name: String
    percentage: Int
  }

  type NovaProject {
    id: String
    title: String
    description: String
    image: String
    image_id: String
    tags: [String]
    link: String
  }

  type NovaTestimonial {
    id: String
    name: String
    position: String
    company: String
    text: String
    avatar: String
    avatar_id: String
  }

  type NovaHero {
    heading: String
    subheading: String
    description: String
    image: String
    image_id: String
  }

  type Nova {
    hero: NovaHero
    skills: [NovaSkill]
    projects: [NovaProject]
    testimonials: [NovaTestimonial]
    contact: NovaContact
    analytics: TemplateAnalytics
  }

  type UserPreferences {
    colors: [String]!
    profession: String!
    email: String!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    subscription: String!
    createdAt: String!
    updatedAt: String!
    arikTemplate: Arik
    novaTemplate: Nova
    selectedTemplates: [String]
    preferences: UserPreferences
    isAdmin: Boolean!
  }

  input TestimonialClientInput {
    client_img_url: String
    client_img_id: String
    client_name: String
    client_company: String
  }

  input ArikTestimonialInput {
    testimonial_heading: String
    testimonial_paragraph: String
    testimonial_client: TestimonialClientInput
  }

  input ArikProcessStepInput {
    step_subheading: String
    step_heading: String
    step_paragraph: String
    step_points: [String]
  }

  input ArikProcessInput {
    process_heading: String
    process_paragraph: String
    steps: [ArikProcessStepInput]
  }

  input ArikServiceInput {
    title: String
    description: String
  }

  input ArikHeroInput {
    hero_heading: String
    hero_subheading: String
    hero_paragraph: String
  }

  input ArikTestimonialsInput {
    testimonials_heading: String
    testimonials_paragraph: String
    testimonials: [ArikTestimonialInput]
  }

  input ArikFooterInput {
    footer_heading: String
    footer_paragraph: String
  }

  input ArikLogosInput {
    img_url: String
    img_id: String
  }

  input ArikWorkExperienceInput {
    project_link: String
    title: String
    category: String
    img_url: String
    img_id: String
  }

  # Nova Template Input Types
  input NovaSocialLinkInput {
    name: String
    url: String
    icon: String
  }

  input NovaContactInput {
    heading: String
    subheading: String
    email: String
    phone: String
    address: String
    social_links: [NovaSocialLinkInput]
  }

  input NovaSkillInput {
    id: String
    name: String
    percentage: Int
  }

  input NovaProjectInput {
    id: String
    title: String
    description: String
    image: String
    image_id: String
    tags: [String]
    link: String
  }

  input NovaTestimonialInput {
    id: String
    name: String
    position: String
    company: String
    text: String
    avatar: String
    avatar_id: String
  }

  input NovaHeroInput {
    heading: String
    subheading: String
    description: String
    image: String
    image_id: String
  }

  input NovaInput {
    hero: NovaHeroInput
    skills: [NovaSkillInput]
    projects: [NovaProjectInput]
    testimonials: [NovaTestimonialInput]
    contact: NovaContactInput
  }

  input VisitorInput {
    ip: String!
    country: String!
    browser: String!
    device: String!
  }

  input ArikInput {
    hero: ArikHeroInput
    logos: [ArikLogosInput]
    services: [ArikServiceInput]
    work: [ArikWorkExperienceInput]
    process: ArikProcessInput
    testimonials: ArikTestimonialsInput
    footer: ArikFooterInput
  }

  input UserPreferencesInput {
    colors: [String]!
    profession: String!
    email: String!
  }

  input UpdateUserInput {
    email: String
    username: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    userByEmail(email: String!): User
    templateAnalytics(userId: ID!, templateName: String!): TemplateAnalytics
  }

  type Mutation {
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
    updateUserTemplate(id: ID!, template: ArikInput!): User
    updateNovaTemplate(id: ID!, template: NovaInput!): User
    addSelectedTemplate(id: ID!, templateName: String!): User
    removeSelectedTemplate(id: ID!, templateName: String!): User
    updateUserPreferences(id: ID!, preferences: UserPreferencesInput!): User
    recordTemplateVisit(userId: ID!, templateName: String!, visitorData: VisitorInput!): Boolean
  }
`;
