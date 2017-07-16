export interface Location {
    top: number,
    bottom?: number,
    left: number,
    right?: number
}
export interface Size {
    width: number,
    height: number
}
export interface SizeAndLocation {
    location: Location,
    size: Size
}