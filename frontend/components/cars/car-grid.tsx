import { Car } from "@/types/car";
import { CarCard } from "./car-card";

export function CarGrid({
  cars,
  className = "",
}: {
  cars: Car[];
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {cars.map((car) => (
        <CarCard car={car} key={car.id} />
      ))}
    </div>
  );
}
