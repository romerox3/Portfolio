export enum AnimationState {
    INITIAL_ROTATION,
    CENTRAL_STAR_GROWTH,
    SUPERNOVA_EXPLOSION,
    BLACK_HOLE_FORMATION,
    JET_FORMATION
  }
  
  export interface AnimationPhase {
    state: AnimationState;
    duration: number;
    update: (time: number, progress: number) => void;
  }