/** Extract value from object */
export type ValueOf<R> = R[Extract<keyof R, string>];
