// game viewport dimensions
export const viewWidth = 540
export const viewHeight = 960

// the distance between notes in pixels per second at speed 1
// TODO: make user configurable
export const noteSpacing = 300

// the distance from the center of notes to the edge of the screen
export const trackMargin = 100

// vertical position of the receptor
export const receptorPosition = viewHeight * 0.88

// vertical position of judgement animation
export const judgementPosition = viewHeight * 0.25

// amount of seconds before song starts
export const songStartDelay = 2

// horizontal distance required to hit a note
export const maxTapDistance = 80

// the visual size of notes
export const noteSize = 50

// timing window constants
export const timingWindowAbsolute = 0.02
export const timingWindowPerfect = 0.08
export const timingWindowGreat = 0.15
export const timingWindowBad = 0.28
