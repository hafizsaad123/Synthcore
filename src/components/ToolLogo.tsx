import React from 'react';

interface ToolLogoProps {
  id: string;
  className?: string;
}

export default function ToolLogo({ id, className = "w-5 h-5" }: ToolLogoProps) {
  const normId = id.toLowerCase();

  if (normId.includes('openai') || normId === 'openai') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="OpenAI ChatGPT">
        <path d="M21.3,10.1a5.6,5.6,0,0,0-2.4-3.8,5.7,5.7,0,0,0-5.3-.8,5.6,5.6,0,0,0-4.9-2.7,5.7,5.7,0,0,0-4.9,3A5.6,5.6,0,0,0,1,9.6a5.7,5.7,0,0,0,2.4,3.8,5.6,5.6,0,0,0,5.3.8,5.7,5.7,0,0,0,4.9,2.7,5.6,5.6,0,0,0,4.9-3A5.6,5.6,0,0,0,23,14.4,5.7,5.7,0,0,0,21.3,10.1ZM12,13a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,13Zm7.4-4.5a4.2,4.2,0,0,1,.1,1.4l-6.8,3.9a1.5,1.5,0,0,1-1.5.1L5.9,10a4.2,4.2,0,0,1,1.9-3.2,4.2,4.2,0,0,1,3.4-.3l3.6,2.1a1.5,1.5,0,0,1,.8,1.3v4.2A4.2,4.2,0,0,1,19.4,8.5Z" />
      </svg>
    );
  }

  if (normId.includes('claude') || normId === 'claude') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Anthropic Claude">
        <path d="M12,2A10,10,0,0,0,4.4,18.5a1.1,1.1,0,0,0,1.5-.2l1.6-1.9a1,1,0,0,0-.1-1.4A6.1,6.1,0,0,1,6,10.5,6,6,0,0,1,12,4.5a5.9,5.9,0,0,1,5.2,3.1,1,1,0,0,0,1.3.4l2.1-1a1.1,1.1,0,0,0,.5-1.4A10,10,0,0,0,12,2Zm6.4,8a5.1,5.1,0,0,0-.7-2.6,1,1,0,0,0-1.4-.3l-1.9,1.1a1,1,0,0,0-.3,1.4,5,5,0,0,1,0,4.8,1,1,0,0,0,.3,1.4l1.9,1.1a1,1,0,0,0,1.4-.3A5.1,5.1,0,0,0,18.4,10ZM12,13.5A1.5,1.5,0,1,0,13.5,15,1.5,1.5,0,0,0,12,13.5Z" />
      </svg>
    );
  }

  if (normId.includes('gemini') || normId === 'gemini') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Google Gemini">
        <path d="M12 2c0 5.52-4.48 10-10 10 5.52 0 10 4.48 10 10 0-5.52 4.48-10 10-10-5.52 0-10-4.48-10-10z" />
        <path d="M19 4c0 1.66-1.34 3-3 3 1.66 0 3 1.34 3 3 0-1.66 1.34-3 3-3-1.66 0-3-1.34-3-3z" opacity="0.8" />
      </svg>
    );
  }

  if (normId.includes('slack') || normId === 'slack') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Slack">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 8.823 0a2.528 2.528 0 0 1 2.522 2.522v2.521h-2.522zm0 1.261a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.78a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043zm10.135 3.762a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522h-2.522V10.066zm-1.262 0a2.528 2.528 0 0 1-2.52 2.522h-5.043a2.528 2.528 0 0 1-2.522-2.522V5.024a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.761 10.154a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52 2.52h-5.043z" />
      </svg>
    );
  }

  if (normId.includes('zapier') || normId === 'zapier') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Zapier">
        <path d="M19,3H5A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V5A2,2,0,0,0,19,3Zm-3,8H13v6H11V11H8V9h8Z" fill="#FF4F00" />
      </svg>
    );
  }

  if (normId.includes('make') || normId === 'make') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-label="Make.com">
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="18" r="3" />
        <circle cx="12" cy="6" r="3" />
        <path d="M9 18h6" />
        <path d="M7.5 15.5l3-6.5" />
        <path d="M16.5 15.5l-3-6.5" />
      </svg>
    );
  }

  if (normId.includes('hubspot') || normId === 'hubspot') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="HubSpot">
        <path d="M21.4,14.2a2.8,2.8,0,0,0-3.3-1.6l-2.6-2.6a3,3,0,0,0,.1-.6,3.1,3.1,0,0,0-.4-1.6l2.1-2.1a2.8,2.8,0,0,0,1.5.4,2.9,2.9,0,1,0-2.9-2.9,2.8,2.8,0,0,0,.4,1.5L14.2,6.8a3,3,0,1,0-4.4,4.4l2.1,2.1a3,3,0,0,0,1.6-.4l2.1,2.1a3,3,0,1,0-4.4,4.4l2.1,2.1a3,3,0,0,0,1.6-.4l2.6,2.6a2.8,2.8,0,0,0-.4,1.5,2.9,2.9,0,1,0,5.7-1.3l0-.2ZM4.5,12a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,4.5,12Z" />
      </svg>
    );
  }

  if (normId.includes('salesforce') || normId === 'salesforce') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Salesforce">
        <path d="M19.3 11.5c.2-.5.3-1 .3-1.6 0-2.7-2.2-4.9-4.9-4.9-1.3 0-2.5.5-3.4 1.3C10.5 5 8.9 4 7 4c-3.3 0-6 2.7-6 6 0 .5.1.9.2 1.4C.5 12.2 0 13.3 0 14.5c0 2.5 2 4.5 4.5 4.5h14c3 0 5.5-2.5 5.5-5.5 0-2.4-1.6-4.4-4.7-4.5z" />
      </svg>
    );
  }

  if (normId.includes('notion') || normId === 'notion') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Notion">
        <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 3v12h2.5l3.5-6.5V18H16V6h-2.5L10 12.5V6H6z" />
      </svg>
    );
  }

  // Fallback / Custom API
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-label="Webhook API">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
      <line x1="10" y1="20" x2="14" y2="4" />
    </svg>
  );
}
