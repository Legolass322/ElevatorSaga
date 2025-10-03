import type { Program, Elevator, Floor } from "../types"

const program: Program = {
  init(elevators, floors) {
    let HIGHEST_FLOOR = 1

    const updateDestinationQueue = (elevator: Elevator) => {
      const currentDirection = elevator.destinationDirection()
      const getQueue = () => {
        const currentFloor = elevator.currentFloor()

        let queue = [...new Set(elevator.destinationQueue)].sort((a, b) => a - b)

        const elevatorIndex = queue.findIndex(floor => floor > currentFloor)

        if (elevatorIndex === -1) {
          return queue.reverse()
        }

        if (currentDirection === 'up') {
          return [...queue.slice(elevatorIndex), ...queue.slice(0, elevatorIndex).reverse()]
        }

        if (currentDirection === 'down') {
          return [...queue.slice(0, elevatorIndex).reverse(), ...queue.slice(elevatorIndex)]
        }

        return queue
      }

      elevator.destinationQueue = getQueue()
      elevator.checkDestinationQueue()
    }

    for (const elevator of elevators) {
      elevator.on('floor_button_pressed', (floorNum) => {
        if (elevator.currentFloor() != floorNum && !elevator.destinationQueue.includes(floorNum)) {
          elevator.goToFloor(floorNum)
          updateDestinationQueue(elevator)
        }
      })
    }

    const getFloorDistance = (elevator: Elevator, floor: Floor) => {
      if (elevator.goingDownIndicator() && elevator.goingUpIndicator()
        || elevator.currentFloor() < floor.floorNum() && elevator.goingUpIndicator()
        || elevator.currentFloor() > floor.floorNum() && elevator.goingDownIndicator()
      ) {
        return Math.abs(elevator.currentFloor() - floor.floorNum())
      }

      return elevator.goingUpIndicator() ? elevator.currentFloor() + floor.floorNum() : HIGHEST_FLOOR - elevator.currentFloor() + floor.floorNum()
    }

    floors.forEach(floor => {
      if (floor.floorNum() > HIGHEST_FLOOR) {
        HIGHEST_FLOOR = floor.floorNum()
      }
      
      const handler = () => {
        const closestElevator = elevators.sort((elevatorA, elevatorB) => {
          if (!elevatorA.destinationQueue.length) {
            return -1
          }

          if (!elevatorB.destinationQueue.length) {
            return 1
          }

          return getFloorDistance(elevatorA, floor) - getFloorDistance(elevatorB, floor)
        })[0]

        if (closestElevator.loadFactor() < .75) {
          closestElevator.goToFloor(floor.floorNum())
          updateDestinationQueue(closestElevator)
        }
      }
      floor.on('up_button_pressed', handler)
      floor.on('down_button_pressed', handler)
    })
  },
  update() { }
}
