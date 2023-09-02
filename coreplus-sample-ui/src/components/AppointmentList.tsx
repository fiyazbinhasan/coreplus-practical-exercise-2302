import { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";
import { IAppointment } from "../models/IAppointment";

export interface AppointmentListProps {
  practitionerId: number;
  onAppointmentSelected: (appointment: IAppointment) => void;
}

export function AppointmentList({
  practitionerId, onAppointmentSelected,
}: AppointmentListProps) {
  const [data, setData] = useState<IAppointment[]>([]);

  useEffect(() => {
    fetch(
      `https://localhost:7091/appointments?practitionerId=${practitionerId}`
    )
      .then((response) => response.json())
      .then((json) => setData(json));
  }, [practitionerId]);

  function formatDate(date: Date) {
    return format(new Date(date), "MMM dd, yyyy");
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-primary shadow-sm">
          <th className="border text-left px-4">Date</th>
          <th className="border text-left px-4">Cost</th>
          <th className="border text-left px-4">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <Fragment key={index}>
            <tr
              className="text-primary hover:text-secondary cursor-pointer"
              onClick={(e) => onAppointmentSelected(item)}
            >
              <td className="border text-left px-4">{formatDate(item.date)}</td>
              <td className="border text-left px-4">{item.cost}</td>
              <td className="border text-left px-4">{item.revenue}</td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
