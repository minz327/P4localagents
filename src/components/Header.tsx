import React from 'react'
import { Alert20Regular } from '@fluentui/react-icons'

/* Fluent 20px icon: Megaphone Loud (from Figma) */
const MegaphoneLoudIcon = () => (
  <svg width="20" height="20" viewBox="0 0 17.0012 17.9985" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12.1602 0.025794C12.4222 0.113118 12.5638 0.396278 12.4764 0.65825L11.9764 2.15825C11.8891 2.42022 11.6059 2.5618 11.344 2.47448C11.082 2.38715 10.9404 2.10399 11.0277 1.84202L11.5277 0.342022C11.6151 0.0800501 11.8982 -0.0615299 12.1602 0.025794ZM15.8565 1.85368C16.0517 1.65841 16.0517 1.34183 15.8565 1.14657C15.6612 0.951307 15.3446 0.951307 15.1494 1.14657L13.1494 3.14657C12.9541 3.34183 12.9541 3.65841 13.1494 3.85368C13.3446 4.04894 13.6612 4.04894 13.8565 3.85368L15.8565 1.85368ZM5.60899 2.14558C6.21267 0.875028 7.90464 0.608181 8.87006 1.63126L15.4568 8.61146C16.4051 9.6164 16.073 11.2573 14.8085 11.8144L10.8714 13.5488C10.9564 13.8508 11.0018 14.1693 11.0018 14.4985C11.0018 16.4315 9.43479 17.9985 7.50179 17.9985C6.24602 17.9985 5.14472 17.3371 4.52717 16.3437L3.32655 16.8727C2.76239 17.1212 2.10361 16.9992 1.66579 16.5652L0.444019 15.3541C-0.00834796 14.9056 -0.128162 14.2204 0.145198 13.6451L5.60899 2.14558ZM5.45535 15.9348C5.90769 16.5781 6.65565 16.9985 7.50179 16.9985C8.88251 16.9985 10.0018 15.8792 10.0018 14.4985C10.0018 14.3128 9.98156 14.1319 9.94317 13.9578L5.45535 15.9348ZM8.14275 2.31757C7.66005 1.80603 6.81406 1.93946 6.51222 2.57473L1.04843 14.0742C0.957309 14.266 0.997247 14.4944 1.14804 14.6439L2.36981 15.855C2.51575 15.9997 2.73534 16.0404 2.92339 15.9575L14.4054 10.8992C15.0376 10.6207 15.2037 9.80024 14.7295 9.29777L8.14275 2.31757ZM15.002 5.00012C14.7258 5.00012 14.502 5.22398 14.502 5.50012C14.502 5.77626 14.7258 6.00012 15.002 6.00012H16.5012C16.7773 6.00012 17.0012 5.77626 17.0012 5.50012C17.0012 5.22398 16.7773 5.00012 16.5012 5.00012H15.002Z" />
  </svg>
)

/* Fluent 20px icon: Settings (from Figma) */
const SettingsHeaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16.2271 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0.0242728 5.88266C0.393563 4.74053 1.00191 3.69213 1.80461 2.80364C1.94035 2.65339 2.15331 2.59984 2.34397 2.66802L4.26225 3.35392C4.78233 3.53977 5.35459 3.26883 5.54045 2.74875C5.55872 2.69762 5.5728 2.64507 5.58253 2.59173L5.94799 0.585725C5.98432 0.386273 6.1375 0.228505 6.3358 0.186297C6.91599 0.0628015 7.51086 0 8.11354 0C8.71584 0 9.31037 0.0627251 9.89022 0.186072C10.0885 0.228241 10.2416 0.38591 10.2781 0.585286L10.6445 2.59165C10.7436 3.13497 11.2644 3.4951 11.8077 3.39601C11.8611 3.38627 11.9137 3.37219 11.9647 3.35395L13.8831 2.66802C14.0738 2.59984 14.2867 2.65339 14.4225 2.80364C15.2252 3.69213 15.8335 4.74053 16.2028 5.88266C16.2651 6.07534 16.205 6.28658 16.0507 6.41764L14.4958 7.73773C14.0748 8.0952 14.0233 8.72627 14.3808 9.14726C14.416 9.18865 14.4544 9.22712 14.4958 9.26225L16.0507 10.5824C16.205 10.7134 16.2651 10.9247 16.2028 11.1173C15.8335 12.2595 15.2252 13.3079 14.4225 14.1964C14.2867 14.3466 14.0738 14.4002 13.8831 14.332L11.9648 13.6461C11.4447 13.4602 10.8725 13.7312 10.6866 14.2512C10.6684 14.3024 10.6543 14.3549 10.6445 14.4085L10.2781 16.4147C10.2416 16.6141 10.0885 16.7718 9.89022 16.8139C9.31037 16.9373 8.71584 17 8.11354 17C7.51086 17 6.91599 16.9372 6.3358 16.8137C6.1375 16.7715 5.98432 16.6137 5.94799 16.4143L5.58254 14.4084C5.48346 13.865 4.96268 13.5049 4.41936 13.604C4.36593 13.6137 4.31339 13.6278 4.26234 13.6461L2.34397 14.332C2.15331 14.4002 1.94035 14.3466 1.80461 14.1964C1.00191 13.3079 0.393563 12.2595 0.0242728 11.1173C-0.038028 10.9247 0.0220447 10.7134 0.176415 10.5824L1.73126 9.26227C2.15225 8.9048 2.20374 8.27373 1.84627 7.85274C1.81112 7.81135 1.77265 7.77288 1.73128 7.73775L0.176415 6.41764C0.0220447 6.28658 -0.038028 6.07534 0.0242728 5.88266ZM1.08482 5.87709L2.37852 6.97546C2.46131 7.04576 2.53824 7.12269 2.60854 7.20548C3.32348 8.04746 3.2205 9.3096 2.37849 10.0246L1.08482 11.1229C1.37687 11.9051 1.79832 12.6322 2.32976 13.2751L3.92574 12.7044C4.02802 12.6679 4.1331 12.6397 4.23995 12.6202C5.3266 12.422 6.36815 13.1423 6.56633 14.229L6.8703 15.8975C7.27817 15.9655 7.69353 16 8.11354 16C8.53327 16 8.94834 15.9656 9.35595 15.8976L9.66076 14.2289C9.68025 14.1221 9.7084 14.017 9.74495 13.9147C10.1167 12.8746 11.2612 12.3327 12.3014 12.7044L13.8973 13.2751C14.4288 12.6322 14.8502 11.9051 15.1423 11.1229L13.8486 10.0245C13.7658 9.95424 13.6888 9.87731 13.6185 9.79452C12.9036 8.95254 13.0066 7.6904 13.8486 6.97544L15.1423 5.87709C14.8502 5.09486 14.4288 4.36783 13.8973 3.72494L12.3013 4.29559C12.1991 4.33214 12.094 4.3603 11.9871 4.37979C10.9005 4.57796 9.85893 3.8577 9.66078 2.77119L9.35595 1.10235C8.94834 1.03443 8.53327 1 8.11354 1C7.69353 1 7.27817 1.03448 6.8703 1.10249L6.56632 2.77105C6.54683 2.87791 6.51867 2.98299 6.48212 3.08527C6.11042 4.12542 4.96589 4.6673 3.92565 4.29556L2.32976 3.72494C1.79832 4.36783 1.37687 5.09486 1.08482 5.87709ZM5.61354 8.5C5.61354 7.11929 6.73283 6 8.11354 6C9.49425 6 10.6135 7.11929 10.6135 8.5C10.6135 9.88071 9.49425 11 8.11354 11C6.73283 11 5.61354 9.88071 5.61354 8.5ZM6.61354 8.5C6.61354 9.32843 7.28511 10 8.11354 10C8.94197 10 9.61354 9.32843 9.61354 8.5C9.61354 7.67157 8.94197 7 8.11354 7C7.28511 7 6.61354 7.67157 6.61354 8.5Z" />
  </svg>
)

/* Fluent 20px icon: Question Circle */
const QuestionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 10.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM10 6a2.5 2.5 0 0 1 1.65 4.38l-.24.18-.16.12-.15.13-.1.1V12a.5.5 0 0 1-1 .09V10.5a.5.5 0 0 1 .14-.35A3.45 3.45 0 0 1 10.5 10l.27-.21A1.5 1.5 0 1 0 8.5 8.5a.5.5 0 0 1-1 0A2.5 2.5 0 0 1 10 6Z" />
  </svg>
)

/* Fluent 20px icon: Person Feedback */
const PersonFeedbackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM7 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-3.25 9A2.75 2.75 0 0 1 6.5 12.25h3a.5.5 0 0 1 0 1h-3c-.97 0-1.75.78-1.75 1.75 0 1.24.76 2.06 1.88 2.57A8.99 8.99 0 0 0 10 18.5c.97 0 1.92-.2 2.84-.5a4.83 4.83 0 0 1-.4-.93A7.88 7.88 0 0 1 10 17.5c-1.46 0-2.66-.32-3.52-.74C5.58 16.33 5 15.72 5 15h-.25Zm10.75.5v-.5a2 2 0 1 1 4 0v.5h.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h.5Zm1-.5v.5h2v-.5a1 1 0 1 0-2 0Zm-1.5 1.5v3h5v-3h-5Z" />
  </svg>
)

/* Copilot icon with gradient */
const CopilotIcon = () => (
  <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 17.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.64517 0.989724C4.44456 0.398066 3.88926 0 3.26452 0L2.36398 0C1.66288 0 1.06107 0.499046 0.931308 1.18803L0 6.13282L0.46302 4.54883C0.644723 3.92722 1.21471 3.5 1.86233 3.5L4.7411 3.5L5.9856 5.12858L7.09359 3.5L6.5414 3.5C5.91666 3.5 5.36136 3.10193 5.16075 2.51027L4.64517 0.989724Z" fill="url(#hdr_cplt_a)" transform="translate(10.71, 0.09) scale(1.25)" />
    <path d="M2.43277 4.86887C2.63136 5.46393 3.18834 5.86523 3.81567 5.86523H5.2819C6.07767 5.86523 6.72643 5.2271 6.73956 4.43143L6.8127 0L6.42736 1.31681C6.24552 1.93821 5.67564 2.36523 5.02818 2.36523L2.13826 2.36523L0.90791 1.27989L0 2.36523H0.546876C1.1742 2.36523 1.73118 2.76654 1.92977 3.3616L2.43277 4.86887Z" fill="url(#hdr_cplt_b)" transform="translate(0.85, 8.93) scale(1.25)" />
    <g transform="translate(0, 2.19) scale(1.25)">
      <path d="M10.0004 0H4.16755C2.50102 0 1.50109 2.20235 0.834479 4.40471C0.044714 7.01392 -0.988711 10.5035 2.00105 10.5035H4.69024C5.34194 10.5035 5.91403 10.0727 6.09306 9.44608C6.52129 7.94725 7.32308 5.15282 7.94795 3.04403C8.25428 2.01026 8.50944 1.12243 8.90103 0.569545C9.12058 0.259577 9.48649 0 10.0004 0Z" fill="url(#hdr_cplt_c)" />
      <path d="M10.0004 0H4.16755C2.50102 0 1.50109 2.20235 0.834479 4.40471C0.044714 7.01392 -0.988711 10.5035 2.00105 10.5035H4.69024C5.34194 10.5035 5.91403 10.0727 6.09306 9.44608C6.52129 7.94725 7.32308 5.15282 7.94795 3.04403C8.25428 2.01026 8.50944 1.12243 8.90103 0.569545C9.12058 0.259577 9.48649 0 10.0004 0Z" fill="url(#hdr_cplt_c2)" />
    </g>
    <g transform="translate(7.5, 4.69) scale(1.25)">
      <path d="M0 10.5023H5.83288C7.49941 10.5023 8.49934 8.30024 9.16595 6.09814C9.95572 3.48921 10.9891 0 7.99938 0H5.31016C4.65848 0 4.08639 0.4308 3.90735 1.0574C3.47911 2.55609 2.67734 5.35014 2.05248 7.45866C1.74615 8.49232 1.49099 9.38005 1.0994 9.93287C0.879853 10.2428 0.513946 10.5023 0 10.5023Z" fill="url(#hdr_cplt_d)" />
      <path d="M0 10.5023H5.83288C7.49941 10.5023 8.49934 8.30024 9.16595 6.09814C9.95572 3.48921 10.9891 0 7.99938 0H5.31016C4.65848 0 4.08639 0.4308 3.90735 1.0574C3.47911 2.55609 2.67734 5.35014 2.05248 7.45866C1.74615 8.49232 1.49099 9.38005 1.0994 9.93287C0.879853 10.2428 0.513946 10.5023 0 10.5023Z" fill="url(#hdr_cplt_d2)" />
    </g>
    <defs>
      <radialGradient id="hdr_cplt_a" cx="0" cy="0" r="1" gradientTransform="matrix(-4.02 -5 -4.34 4.2 6.06 6.17)" gradientUnits="userSpaceOnUse">
        <stop offset="0.096" stopColor="#00AEFF" />
        <stop offset="0.773" stopColor="#2253CE" />
        <stop offset="1" stopColor="#0736C4" />
      </radialGradient>
      <radialGradient id="hdr_cplt_b" cx="0" cy="0" r="1" gradientTransform="matrix(3.56 4.42 4.21 -3.61 1.24 1.93)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB657" />
        <stop offset="0.634" stopColor="#FF5F3D" />
        <stop offset="0.923" stopColor="#C02B3C" />
      </radialGradient>
      <radialGradient id="hdr_cplt_c" cx="0" cy="0" r="1" gradientTransform="matrix(-0.53 -9.31 52.28 -2.97 4.02 10.5)" gradientUnits="userSpaceOnUse">
        <stop offset="0.03" stopColor="#FFC800" />
        <stop offset="0.31" stopColor="#98BD42" />
        <stop offset="0.49" stopColor="#52B471" />
        <stop offset="0.844" stopColor="#0D91E1" />
      </radialGradient>
      <linearGradient id="hdr_cplt_c2" x1="4.55" y1="0" x2="5" y2="10.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3DCBFF" />
        <stop offset="0.247" stopColor="#0588F7" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="hdr_cplt_d" cx="0" cy="0" r="1" gradientTransform="matrix(-4.61 13.17 -15.68 -5.81 8.3 -1.03)" gradientUnits="userSpaceOnUse">
        <stop offset="0.066" stopColor="#8C48FF" />
        <stop offset="0.5" stopColor="#F2598A" />
        <stop offset="0.896" stopColor="#FFB152" />
      </radialGradient>
      <linearGradient id="hdr_cplt_d2" x1="8.76" y1="-0.64" x2="8.75" y2="2.22" gradientUnits="userSpaceOnUse">
        <stop offset="0.058" stopColor="#F8ADFA" />
        <stop offset="0.708" stopColor="#A86EDD" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
)

/* Waffle/Grid Dots icon */
const GridDotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="1.5" />
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="19" cy="5" r="1.5" />
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
    <circle cx="5" cy="19" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
    <circle cx="19" cy="19" r="1.5" />
  </svg>
)

export default function Header() {
  return (
    <header className="bg-[#0060ca] h-12 flex items-center justify-between text-white shrink-0 z-50 relative">
      {/* Left actions */}
      <div className="flex flex-1 items-center min-w-0">
        <button className="flex items-center justify-center w-12 h-12 shrink-0 rounded hover:bg-white/10" aria-label="App menu">
          <GridDotsIcon />
        </button>
        <div className="flex items-center gap-2 h-12 px-3 shrink-0">
          <span className="font-semibold text-[16px] leading-[22px] text-white whitespace-nowrap">Microsoft Purview</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex flex-1 items-center justify-end px-2">
        {/* Copilot CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="bg-white border border-[#D1D1D1] rounded-[4px] px-3 py-[6px] text-[#242424] text-[14px] leading-[20px] font-semibold flex items-center gap-[6px]">
            <CopilotIcon />
            <span>Copilot</span>
          </button>
          {/* Divider */}
          <div className="flex items-center justify-center h-8 px-1">
            <div className="w-px h-[21px] bg-white/40" />
          </div>
        </div>

        {/* Announcement */}
        <button className="flex items-center justify-center w-12 h-12 shrink-0 text-white rounded hover:bg-white/10" aria-label="Announcements">
          <MegaphoneLoudIcon />
        </button>

        {/* Notification */}
        <button className="flex items-center justify-center w-12 h-12 shrink-0 text-white rounded hover:bg-white/10" aria-label="Notifications">
          <Alert20Regular />
        </button>

        {/* Settings */}
        <button className="flex items-center justify-center w-12 h-12 shrink-0 text-white rounded hover:bg-white/10" aria-label="Settings">
          <SettingsHeaderIcon />
        </button>

        {/* Help */}
        <button className="flex items-center justify-center w-12 h-12 shrink-0 text-white rounded hover:bg-white/10" aria-label="Help">
          <QuestionIcon />
        </button>

        {/* Feedback */}
        <button className="flex items-center justify-center w-12 h-12 shrink-0 text-white rounded hover:bg-white/10" aria-label="Feedback">
          <PersonFeedbackIcon />
        </button>

        {/* Avatar */}
        <div className="flex items-center justify-center w-12 h-12 shrink-0">
          <div className="w-7 h-7 bg-purple-700 rounded-full flex items-center justify-center text-xs cursor-pointer">
            MZ
          </div>
        </div>
      </div>
    </header>
  )
}

