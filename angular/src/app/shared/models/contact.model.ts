import { Company } from "./company.model";

export class Contact {
  id?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  image_url?: string;
  logo_url?: string;
  headline?: string;
  company?: Company;
  email?: string;
  phone?: string;
  email_status?: string;
  phone_verified?: boolean;
  is_fresh?: boolean;
  li_updated_at?: string;
  updated_at?: string;
  linkedin_url?: string;
  facebook_url?: string;
  slack_url?: string;
  twitter_url?: string;
  current_companies_and_positions?: {};
  current_position?: any;
  past_positions?: any;
  company_name?: string;
  li_member_id?: string;
  is_from_tp?: boolean;
  title?: string;
  tp_contact_id?: string;
  personal_email?: string;
  location?: string;
  work_email?: string;
  lastUpdatedDate? : number;
  overall_verification_status?: string;
  other_current_positions?: any
  education?: any
  isNew?:boolean;
  full_name?:string;
  profile_refresh_status?: any;
}
