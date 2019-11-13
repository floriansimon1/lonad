import { Optional } from "../index";

interface User { carId:     number };
interface Car  { modelName: string };

function noneIsCompatibleWithAnyOptional(): Optional<Car>[] {
  const carsDictionary: Record<number, Car> = { 1: { modelName: "Lada" } };

  function getUserCar(user: User): Optional<Car> {
    if (carsDictionary[user.carId] === undefined) {
      return Optional.None();
    }

    return Optional.Some(carsDictionary[user.carId]);
  }

  return [getUserCar({ carId: 0 }), getUserCar({ carId: 1 })];
}
