import { IData } from '../types/types'

const getTile = (index: number, obj: IData, revolverplayTime: number): string => {
  const template = `
    <div class="plugin-endcard-tile" data-idx="${index}" data-role="plugin-endcard-tile">
      ${index === 0 && revolverplayTime !== 0
        ? '<button class="plugin-endcard-button-pause" data-role="plugin-endcard-pause">Anhalten</button>'
        : ''}  
      <div class="plugin-endcard-thumbnail" style="background-image: url(${obj.image});"></div>
      <div class="plugin-endcard-overlay">
        ${index === 0
        ? `
          <svg class="plugin-endcard-revolverplay-icon" width="103" height="75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d)">
              <path d="M62.073 37.89l-20-13.333A1.334 1.334 0 0040 25.667v26.666a1.334 1.334 0 002.073 1.11l20-13.334a1.335 1.335 0 000-2.218z" fill="#fff"/>
            </g>
            <circle class="plugin-endcard-progress-meter" cx="48" cy="39" r="30.667" fill="none" stroke="#fff" stroke-width="2.667"/>
            <circle class="plugin-endcard-progress-value" cx="48" cy="39" r="30.667" transform="rotate(-90 48 39)" fill="none" stroke="#fff" stroke-width="2.667" stroke-dasharray="192.686" stroke-dashoffset="192.686" />
            <defs>
              <filter id="filter0_d" x="-5.333" y="-1" width="112" height="112" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset dy="16"/><feGaussianBlur stdDeviation="20"/>
                <feColorMatrix values="0 0 0 0 0.490196 0 0 0 0 0.596078 0 0 0 0 0.698039 0 0 0 0.2 0"/>
                <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
            </defs>
          </svg> 
        `
        : `
        <svg class="plugin-endcard-play-icon" width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.555 10.168L1.555 0.168C1.248 -0.0359995 0.853 -0.0559995 0.529 0.118001C0.203 0.292001 0 0.631001 0 1V21C0 21.369 0.203 21.708 0.528 21.882C0.676 21.961 0.838 22 1 22C1.194 22 1.388 21.943 1.555 21.832L16.555 11.832C16.833 11.646 17 11.334 17 11C17 10.666 16.833 10.354 16.555 10.168Z" fill="white"/>
        </svg>
        `}
        <p class="plugin-endcard-title">
          ${index === 0 ? '<span class="plugin-endcard-title-pre">Nächstes Video</span>' : ''}
          ${obj.title}
        </p>
      </div>
    </div>

  `

  return template
}

export default getTile
