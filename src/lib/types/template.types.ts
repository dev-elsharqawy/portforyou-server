export interface ITestimonialClient {
  client_img_url: string;
  client_img_id?: string;
  client_name: string;
  client_company: string;
}

export interface IArikTestimonial {
  testimonial_img_url: string;
  testimonial_img_id?: string;
  testimonial_heading: string;
  testimonial_paragraph: string;
  testimonial_client: ITestimonialClient;
}

export interface IArikProcessStep {
  step_heading: string;
  step_subheading: string;
  step_paragraph: string;
  step_points: string[];
}

export interface IArikProcess {
  process_heading: string;
  process_paragraph: string;
  steps: IArikProcessStep[];
}

export interface IArikService {
  title: string;
  description: string;
}

export interface IArikHero {
  hero_heading: string;
  hero_paragraph: string;
}

export interface IArikTestimonials {
  testimonials_heading: string;
  testimonials_paragraph: string;
  testimonials: IArikTestimonial[];
}

export interface IArikFooter {
  footer_slug: string;
  footer_heading: string;
  footer_paragraph: string;
}

export interface IArikLogos {
  img_url: string;
  img_id?: string;
}

export interface IArikWorkExperience {
  title: string;
  category: string;
  img_url: string;
  img_id?: string;
}

export interface IVisitorInfo {
  ip: string;
  country: string;
  browser: string;
  device: "mobile" | "desktop";
  visitDate: Date;
}

export interface ITemplateAnalytics {
  visitors: IVisitorInfo[];
  totalVisits: number;
}

export interface IArikTemplate {
  hero: IArikHero;
  logos: IArikLogos[];
  services: IArikService[];
  work: IArikWorkExperience[];
  process: IArikProcess;
  testimonials: IArikTestimonials;
  footer: IArikFooter;
  analytics?: ITemplateAnalytics;
}
