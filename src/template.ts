import { IData } from '../types/types'

const getCard = (index: number, obj: IData, revolverplayTime: number): string => {
  const template = `
    <div class="plugin-endcard-card" data-idx="${index}" data-role="plugin-endcard-card">
      <div class="plugin-endcard-thumbnail" style="background-image: url(${obj.image});"></div>
      <span class="plugin-endcard-title">${obj.title}</span>
      ${index === 0
      ? `
        <div class="plugin-endcard-play-icon">
          <svg class="plugin-endcard-progress-icon" viewBox="0 0 120 120">
            <circle class="plugin-endcard-progress-meter"  cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" stroke-width="3" />
            <circle class="plugin-endcard-progress-value" cx="60" cy="60" r="54" fill="none" stroke="#f77a52" stroke-width="3" stroke-dasharray="339.292" stroke-dashoffset="339.292" />
            <path fill="#e6e6e6" d="m 60.940678,83.618644 -25,-32 h 51 z"/>
          </svg>
        </div>
        ${revolverplayTime !== 0
          ? '<button class="plugin-endcard-pause" data-role="plugin-endcard-pause">Anhalten</button>'
          : ''}  
      `
      : ''}
    </div>
  `

  return template
}

export default getCard
