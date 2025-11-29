import React from 'react';
import { FiMail, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => <FiLinkedin {...props} />;
export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => <FiInstagram {...props} />;
export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => <FiMail {...props} />;
export const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => <FaWhatsapp {...props} />;

export const socialMediaIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
  Email: MailIcon,
  Whatsapp: WhatsappIcon,
};

export type SocialPlatform = keyof typeof socialMediaIcons;

export const getSocialIcon = (platform: string | undefined): React.FC<React.SVGProps<SVGSVGElement>> | null => {
  if (!platform) return null;
  return socialMediaIcons[platform] || null;
};