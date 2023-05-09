/**
 * Bachelor thesis: Vojtech Maslan
 *
 * Static values
 */

export enum PlayerTypes {
    BOTTOM = 'bottom_player',
    TOP = 'top_player',
}


export enum StrokeTypes {
    NOTHING = 0,
    FOREHAND = 1,
    BACKHAND = 2,
    LOB = 3,
    SERVE = 4,
    SMASH = 5,
    RETURN = 6,

}

export enum StrokeTypesAgg {
    NOTHING = 0,
    BOTTOM = 1,
    SMASH = 2,
    RETURN = 3,

}

export interface PlayerFrameInformation {
    pose: number[][];
    position: number[] | null,
    stroke: StrokeTypesAgg,
}
