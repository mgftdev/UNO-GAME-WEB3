export interface WildCard {
    readonly type: 'WILD'
  }
  
  export interface WildDrawCard {
    readonly type: 'WILD DRAW'
  }
  
  export type AnyWildCard = WildCard | WildDrawCard
  
  export function wildCard(): WildCard {
    return { type: 'WILD' }
  }
  
  export function wildDrawCard(): WildDrawCard {
    return { type: 'WILD DRAW' }
  }