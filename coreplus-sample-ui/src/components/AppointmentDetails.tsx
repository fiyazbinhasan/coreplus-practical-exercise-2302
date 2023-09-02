import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { IAppointmentDetails } from "../models/IAppointmentDetails";

export interface AppointmentDetailsProps {
  selectedAppointmentId: number;
}

export function AppointmentDetails({
  selectedAppointmentId,
}: AppointmentDetailsProps) {
  const [data, setData] = useState<IAppointmentDetails>({
    date: new Date(),
    client_name: "",
    appointment_type: "",
    duration: 0,
  });

  useEffect(() => {
    fetch(`https://localhost:7091/appointments/${selectedAppointmentId}`)
      .then((response) => response.json())
      .then((json) => setData(json));
  }, [selectedAppointmentId]);

  function formatDate(date: Date) {
    return format(new Date(date), "MMM dd, yyyy");
  }

  return (
    <div>
      <p>Date: {formatDate(data.date)}</p>
      <p>Client: {data.client_name}</p>
      <p>Type: {data.appointment_type}</p>
      <p>Duration: {data.duration} mins</p>
    </div>
  );
}
