import type { Program } from "../types"

const program: Program = {
  init(elevators, floors) {
    const elevator = elevators[0];

    elevator.on('floor_button_pressed', (floorNum) => {
      if (elevator.currentFloor() != floorNum || !elevator.destinationQueue.includes(floorNum)) {
        elevator.goToFloor(floorNum)
      }
    })

    floors.forEach(floor => {
      const handler = () => {
        if (elevator.currentFloor() != floor.floorNum() || !elevator.destinationQueue.includes(floor.floorNum())) {
          elevator.goToFloor(floor.floorNum())
        }
      }
      floor.on('up_button_pressed', handler)
      floor.on('down_button_pressed', handler)
    })
  },
  update() { }
}
