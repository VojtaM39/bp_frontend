export enum PlayerTypes {
    BOTTOM = 'bottom',
    TOP = 'top',
}


export enum StrokeTypes {
    NOTHING,
    BOTTOM,
    TOP,
    RETURN,
}

export interface PlayerFrameInformation {
    skeleton: number[][];
    position: number[] | null,
    stroke: StrokeTypes,
}
