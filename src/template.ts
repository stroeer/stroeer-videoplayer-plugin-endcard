import { IData } from '../types/types'

const getCardTemplate = (index: number, obj: IData): string => {
  const template = `
    <div class="plugin-endcard-card" data-role="plugin-endcard-card">
      <div class="plugin-endcard-thumbnail" style="background-image: url(${obj.image});"></div>
      <span class="plugin-endcard-title">${obj.title}</span>
      ${index === 0
? `
        <button>Play SVG with animation</button>
        <button data-role="plugin-endcard-pause">Anhalten</button>
      `
: ''}
    </div>
  `

  return template
}

export default getCardTemplate
