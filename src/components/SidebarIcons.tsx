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
    <svg width={size} height={size} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M18.4881 7.5114C18.5905 7.6142 18.6862 7.72306 18.7746 7.83723C19.0152 8.14812 19.2018 8.49849 19.3254 8.87378L19.8727 10.5565C19.9185 10.6862 20.0034 10.7985 20.1158 10.8779C20.2281 10.9573 20.3624 11 20.5 11C20.6376 11 20.7719 10.9573 20.8842 10.8779C20.9845 10.807 21.0629 10.71 21.1111 10.5978C21.1169 10.5842 21.1223 10.5705 21.1273 10.5565L21.6746 8.87378C21.8448 8.36221 22.132 7.89736 22.5135 7.51616C22.895 7.13496 23.3602 6.84793 23.8722 6.67788L25.5561 6.13101C25.6859 6.08525 25.7983 6.0004 25.8778 5.88813C25.9573 5.77587 26 5.64173 26 5.50421C26 5.36668 25.9573 5.23254 25.8778 5.12028C25.7983 5.00802 25.6859 4.92316 25.5561 4.87741L25.5224 4.86899L23.8385 4.32212C23.3265 4.15207 22.8613 3.86504 22.4798 3.48384C22.0983 3.10264 21.8111 2.63779 21.6409 2.12622L21.0936 0.443537C21.0478 0.313845 20.9629 0.201538 20.8505 0.122099C20.7382 0.0426599 20.604 0 20.4663 0C20.3287 0 20.1944 0.0426599 20.0821 0.122099C19.9697 0.201538 19.8848 0.313845 19.839 0.443537L19.2918 2.12622L19.2778 2.16788C19.1094 2.65949 18.8326 3.10718 18.4675 3.47768C18.0921 3.85862 17.6336 4.14763 17.1278 4.32212L15.4439 4.86899C15.3141 4.91475 15.2017 4.9996 15.1222 5.11187C15.0427 5.22413 15 5.35827 15 5.49579C15 5.63332 15.0427 5.76746 15.1222 5.87972C15.2017 5.99198 15.3141 6.07684 15.4439 6.12259L17.1278 6.66946C17.6407 6.84036 18.1065 7.12868 18.4881 7.5114ZM27.821 12.3575L28.7395 12.6558L28.7579 12.6604C28.8287 12.6854 28.89 12.7316 28.9333 12.7929C28.9767 12.8541 29 12.9273 29 13.0023C29 13.0773 28.9767 13.1505 28.9333 13.2117C28.89 13.2729 28.8287 13.3192 28.7579 13.3442L27.8394 13.6425C27.5601 13.7352 27.3064 13.8918 27.0983 14.0997C26.8902 14.3077 26.7335 14.5612 26.6407 14.8402L26.3422 15.7581C26.3172 15.8288 26.2709 15.8901 26.2096 15.9334C26.1483 15.9767 26.0751 16 26 16C25.9249 16 25.8517 15.9767 25.7904 15.9334C25.7291 15.8901 25.6828 15.8288 25.6578 15.7581L25.3593 14.8402C25.2671 14.5604 25.1107 14.3059 24.9026 14.0971C24.6945 13.8884 24.4404 13.7311 24.1606 13.6379L23.2421 13.3396C23.1713 13.3146 23.11 13.2684 23.0667 13.2071C23.0233 13.1459 23 13.0727 23 12.9977C23 12.9227 23.0233 12.8495 23.0667 12.7883C23.11 12.7271 23.1713 12.6808 23.2421 12.6558L24.1606 12.3575C24.4365 12.2623 24.6866 12.1047 24.8913 11.8969C25.0961 11.6891 25.25 11.4368 25.341 11.1598L25.6395 10.2419C25.6645 10.1712 25.7108 10.1099 25.7721 10.0666C25.8333 10.0233 25.9066 10 25.9816 10C26.0567 10 26.1299 10.0233 26.1912 10.0666C26.2525 10.1099 26.2988 10.1712 26.3238 10.2419L26.6223 11.1598C26.7151 11.4388 26.8718 11.6924 27.0799 11.9003C27.288 12.1082 27.5417 12.2648 27.821 12.3575ZM0 6.25C0 4.45507 1.45507 3 3.25 3H10.75C12.5449 3 14 4.45507 14 6.25V11.75C14 13.5449 12.5449 15 10.75 15H3.25C1.45507 15 0 13.5449 0 11.75V6.25ZM11 21.25C11 19.4551 12.4551 18 14.25 18H22.75C24.5449 18 26 19.4551 26 21.25V25.75C26 27.5449 24.5449 29 22.75 29H14.25C12.4551 29 11 27.5449 11 25.75V21.25ZM0 21.25C0 19.4551 1.45507 18 3.25 18H4.75C6.54493 18 8 19.4551 8 21.25V25.75C8 27.5449 6.54493 29 4.75 29H3.25C1.45507 29 0 27.5449 0 25.75V21.25Z" fill="url(#dspm_gradient)"/>
        <defs>
            <linearGradient id="dspm_gradient" x1="14.5" y1="0" x2="14.5" y2="29" gradientUnits="userSpaceOnUse">
                <stop offset="0.296875" stopColor="#2886DE"/>
                <stop offset="1" stopColor="#316BAA"/>
            </linearGradient>
        </defs>
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
