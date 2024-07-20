import { createEnumType } from "@nexiojs/graphql";

export enum Direction {
  Up = "UP",
  Down = "DOWN",
}

createEnumType(Direction, {
  name: "Direction",
});
