export type Elevator = {
  /**
  * Queue the elevator to go to specified floor number. If you specify true as second argument, the elevator will go to that floor directly, and then go to any other queued floors.
  * ```
  * elevator.goToFloor(3); // Do it after anything else
  * elevator.goToFloor(2, true); // Do it before anything else
  * ```
  */
  goToFloor: (floor: number, force?: boolean) => void

  /**
   * Clear the destination queue and stop the elevator if it is moving. Note that you normally don't need to stop elevators - it is intended for advanced solutions with in-transit rescheduling logic. Also, note that the elevator will probably not stop at a floor, so passengers will not get out.
   * ```
   * elevator.stop();
   * ```
   */
  stop: () => void

  /**
   * Gets the floor number that the elevator currently is on.
   * ```
   * if(elevator.currentFloor() === 0) {
   *     // Do something special?
   * }
   * ```
   */
  currentFloor: () => number

  /**
   * Gets or sets the going up indicator, which will affect passenger behaviour when stopping at floors.
   * ```
   * if(elevator.goingUpIndicator()) {
   *     elevator.goingDownIndicator(false);
   * }
   * ```
   */
  goingUpIndicator: (setter?: boolean) => boolean

  /**
   * Gets or sets the going down indicator, which will affect passenger behaviour when stopping at floors.
   * ```
   * if(elevator.goingDownIndicator()) {
   *     elevator.goingUpIndicator(false);
   * }
   * ```
   */
  goingDownIndicator: (setter?: boolean) => boolean

  /**
   * Gets the maximum number of passengers that can occupy the elevator at the same time.
   * ```
   * if(elevator.maxPassengerCount() > 5) {
   *     // Use this elevator for something special, because it's big
   * }
   * ```
   */
  maxPassengerCount: () => number

  /**
   * Gets the load factor of the elevator. 0 means empty, 1 means full. Varies with passenger weights, which vary - not an exact measure.
   * ```
   * if(elevator.loadFactor() < 0.4) {
   *     // Maybe use this elevator, since it's not full yet?
   * }
   * ```
   */
  loadFactor: () => number

  /**
   * Gets the direction the elevator is currently going to move toward. Can be "up", "down" or "stopped".
   */
  destinationDirection: () => 'up' | 'down' | 'stopped'

  /**
   * The current destination queue, meaning the floor numbers the elevator is scheduled to go to. Can be modified and emptied if desired. Note that you need to call `checkDestinationQueue()` for the change to take effect immediately.
   * ```
   * elevator.destinationQueue = [];
   * elevator.checkDestinationQueue();
   * ```
   */
  destinationQueue: number[]

  /**
   * Checks the destination queue for any new destinations to go to. Note that you only need to call this if you modify the destination queue explicitly.
   * ```
   * elevator.checkDestinationQueue();
   * ```
   */
  checkDestinationQueue: () => void

  /**
   * Gets the currently pressed floor numbers as an array.
   * ```
   * if(elevator.getPressedFloors().length > 0) {
   *     // Maybe go to some chosen floor first?
   * }
   * ```
   */
  getPressedFloors: () => number[]
} & ElevatorOn

interface ElevatorOn {
  on(event: Extract<ElevatorEvent, 'idle'>): void
  on(event: Extract<ElevatorEvent, 'floor_button_pressed' | 'stopped_at_floor'>, handler: (floorNum: number) => void): void
  on(event: Extract<ElevatorEvent, 'passing_floor'>, handler: (floorNum: number, direction: 'up' | 'down') => void): void
}

export type ElevatorEvent =
  | 'idle'
  | 'floor_button_pressed'  // floorNum
  | 'passing_floor'         // floorNum, direction
  | 'stopped_at_floor'      // floorNum

export type Floor = {
  floorNum: () => number
} & FloorOn

interface FloorOn {
  on(event: FloorEvent, handler: () => void): void
}

export type FloorEvent =
  | 'up_button_pressed'
  | 'down_button_pressed'

export type Program = {
  // Do stuff with the elevators and floors, which are both arrays of objects
  init: (elevators: Elevator[], floors: Floor[]) => void
  // Do more stuff with the elevators and floors
  // dt is the number of game seconds that passed since the last time update was called
  update: (dt: number, elevators: Elevator[], floors: Floor[]) => void
}
