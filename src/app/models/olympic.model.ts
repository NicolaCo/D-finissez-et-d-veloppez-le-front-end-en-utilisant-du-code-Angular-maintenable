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
  medalsDetails: MedalsDetails,
  athleteCount: number,
}

export interface MedalsDetails {
  gold: number,
  silver: number,
  bronze: number
}
