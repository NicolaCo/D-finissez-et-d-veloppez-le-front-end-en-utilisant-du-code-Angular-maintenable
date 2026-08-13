export interface Olympic {
  id: number,
  country: string,
  participations: Participation[]
}

export interface Participation {
  id: number,
  year: number,
  city: string,
  medalsCount: number,
  medalsDetails: medalsDetails,
  athleteCount: number,
}

export interface medalsDetails {
  gold: number,
  silver: number,
  bronze: number
}
