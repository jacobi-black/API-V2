/**
 * Interface de base pour tous les modèles avec des propriétés communes.
 */
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
