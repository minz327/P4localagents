import React from 'react'
import { Apps20Regular } from '@fluentui/react-icons'

export const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <path d="M3 10L12 2L21 10V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12H15V22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const SolutionsIcon = () => <Apps20Regular style={{ fontSize: 20 }} />

export const AgentsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const LearnIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const UsageCenterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5"/>
        <path d="M12 8v8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 12h8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)

export const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H15a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const DSPMIcon = ({size=24}: {size?: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#0078D4"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#0078D4" fillOpacity="0.2"/>
        <path d="M19 6L16 6" stroke="#0078D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M17.5 4.5V7.5" stroke="#0078D4" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#0078D4"/>
    </svg>
)

export const CommComplianceIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const AuditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
        <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const DLPIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M8 11h8" strokeWidth="1.5" strokeLinecap="round"/>
         <path d="M12 7v8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)

export const ComplianceManagerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const PostureIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M22 6L12 16L8 12L2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 6H22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const ObjectivesIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
)

export const AIObservabilityIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
         <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
         <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M10 8l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const DiscoverIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M1 1h4v4H1z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 8h15M8 14h15" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
)

export const TasksIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const ReportsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
