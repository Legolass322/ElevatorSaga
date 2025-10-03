import type { Program, Elevator } from "../types"

const program: Program = {
  init(elevators, floors) {
    const elevator = elevators[0];

    const updateDestinationQueue = (elevator: Elevator) => {
      const update = () => {
        const currentFloor = elevator.currentFloor()
        const currentDirection = elevator.destinationDirection()
        
        let queue = [...new Set(elevator.destinationQueue)].sort((a, b) => a - b)
  
        const elevatorIndex = queue.findIndex(floor => floor > currentFloor)
  
        if (elevatorIndex === -1) {
          return queue.reverse()
        }

        if (currentDirection === 'up') {
          return [...queue.slice(elevatorIndex), ...queue.slice(0, elevatorIndex).reverse()]
        }
  
        if (elevator.destinationDirection() === 'down') {
          return [...queue.slice(0, elevatorIndex).reverse(), ...queue.slice(elevatorIndex)]
        }

        return queue
      }
      
      elevator.destinationQueue = update()
      elevator.checkDestinationQueue()
    }

    elevator.on('floor_button_pressed', (floorNum) => {
      if (elevator.currentFloor() != floorNum && !elevator.destinationQueue.includes(floorNum)) {
        elevator.goToFloor(floorNum)
        updateDestinationQueue(elevator)
      }
    })

    floors.forEach(floor => {
      const handler = () => {
        if (elevator.currentFloor() != floor.floorNum() && !elevator.destinationQueue.includes(floor.floorNum()) && elevator.loadFactor() != 1) {
          elevator.goToFloor(floor.floorNum())
          updateDestinationQueue(elevator)
        }
      }
      floor.on('up_button_pressed', handler)
      floor.on('down_button_pressed', handler)
    })
  },
  update() { }
}
