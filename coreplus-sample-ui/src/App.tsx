import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subYears, format } from "date-fns";
import "./app.css";

interface ProfitabilityAnalysis {
  practitioner_id: number;
  revenueByCostPerMonth: RevenueByCostPerMonth[];
}

interface RevenueByCostPerMonth {
  year: number;
  month: number;
  totalRevenue: number;
  totalCost: number;
}

interface Practitioner {
  id: number;
  name: string;
}

function App() {
  const [practitioner, setPractitioner] = useState<Practitioner>();
  const [appointment, setAppointment] = useState<Appointment>();
  const [showAppointments, setShowAppointments] = useState(false);
  const [startDate, setStartDate] = useState(subYears(new Date(), 4));
  const [endDate, setEndDate] = useState(new Date());

  const handleChange = ([newStartDate, newEndDate]: [Date, Date]) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <div className="h-screen">
      <div className="w-full appshell">
        <div className="header flex flex-row items-center p-2 bg-primary shadow-sm">
          <p className="font-bold text-lg">coreplus</p>
        </div>
        <PractitionerList
          onPractitionerSelected={setPractitioner}
        ></PractitionerList>
        <div className="flex flex-col">
          {practitioner && (
            <div className="pracinfo">
              <div className="flex justify-between py-2">
                <DatePicker
                  selected={startDate}
                  onChange={handleChange}
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                />
                <p
                  className="text-primary hover:text-secondary cursor-pointer"
                  onClick={(e) => setShowAppointments(true)}
                >
                  {practitioner.name} &#9207;
                </p>
              </div>
              <ProfitabilityAnalysis
                selectedPractitioner={practitioner}
                range={[startDate, endDate]}
              ></ProfitabilityAnalysis>
            </div>
          )}
        </div>
      </div>

      <div className="appoint-container">
        {showAppointments && (
          <div className="appointlist">
            <div className="border p-2 bg-primary shadow-sm">Appointments</div>
            {practitioner && (
              <AppointmentList
                practitionerId={practitioner.id}
                onAppointmentSelected={(a) => setAppointment(a)}
              ></AppointmentList>
            )}
          </div>
        )}

        {appointment && (
          <div className="appoint-details">
            <AppointmentDetails
              selectedAppointmentId={appointment.id}
            ></AppointmentDetails>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProfitabilityAnalysisProps {
  selectedPractitioner: Practitioner;
  range: [Date, Date | null];
}

function ProfitabilityAnalysis({
  selectedPractitioner,
  range,
}: ProfitabilityAnalysisProps) {
  const [data, setData] = useState<ProfitabilityAnalysis[]>([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetch(
      `https://localhost:7091/appointments/profitability-analysis/${
        selectedPractitioner.id
      }?range=${range[0].toISOString()}&range=${
        range[1] ? range[1].toISOString() : new Date().toISOString()
      }`
    )
      .then((response) => response.json())
      .then((json) => setData(json));
  }, [selectedPractitioner, range]);

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-primary shadow-sm">
          <th className="border text-left px-4">Month</th>
          <th className="border text-left px-4">Cost</th>
          <th className="border text-left px-4">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <Fragment key={item.practitioner_id}>
            {item.revenueByCostPerMonth.map((subItem, index) => (
              <tr key={index}>
                <td className="border text-left px-4">
                  {months[subItem.month - 1]} {subItem.year}
                </td>
                <td className="border text-left px-4">{subItem.totalCost}</td>
                <td className="border text-left px-4">
                  {subItem.totalRevenue}
                </td>
              </tr>
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

interface PractitionerProps {
  onPractitionerSelected: (practitioner: Practitioner) => void;
}

function PractitionerList({ onPractitionerSelected }: PractitionerProps) {
  const [supervisors, setSupervisors] = useState<Practitioner[]>([]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);

  useEffect(() => {
    fetch("https://localhost:7091/practitioners/supervisors")
      .then((response) => response.json())
      .then((data) => {
        setSupervisors(data);
      })
      .catch((error) => {
        // Handle error
      });
  }, []);

  useEffect(() => {
    fetch("https://localhost:7091/practitioners")
      .then((response) => response.json())
      .then((data) => {
        const nonSupervisors = data.filter(
          (practitioner: Practitioner) =>
            !supervisors.some((supervisor) => supervisor.id === practitioner.id)
        );
        setPractitioners(nonSupervisors);
      })
      .catch((error) => {
        // Handle error
      });
  }, [supervisors]);

  return (
    <div className="flex flex-col">
      <div className="supervisors">
        <div className="border p-2 bg-primary shadow-sm">
          Supervisor practitioners
        </div>
        <ul>
          {supervisors.map((s) => (
            <li
              className="px-2 hover:bg-slate-400 cursor-pointer"
              key={s.id}
              onClick={(e) => onPractitionerSelected(s)}
            >
              {s.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="praclist">
        <div className="border p-2 bg-primary shadow-sm">
          Remaining Practitioners
        </div>
        <ul>
          {practitioners.map((s) => (
            <li
              className="px-2 hover:bg-slate-400 cursor-pointer"
              key={s.id}
              onClick={(e) => onPractitionerSelected(s)}
            >
              {s.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface AppointmentListProps {
  practitionerId: number;
  onAppointmentSelected: (appointment: Appointment) => void;
}

interface Appointment {
  id: number;
  date: Date;
  cost: number;
  revenue: number;
}

function AppointmentList({
  practitionerId,
  onAppointmentSelected,
}: AppointmentListProps) {
  const [data, setData] = useState<Appointment[]>([]);

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

interface AppointmentDetailsView {
  date: Date;
  client_name: string;
  appointment_type: string;
  duration: number;
}

interface AppointmentDetailsProps {
  selectedAppointmentId: number;
}

function AppointmentDetails({
  selectedAppointmentId,
}: AppointmentDetailsProps) {
  const [data, setData] = useState<AppointmentDetailsView>({
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

export default App;
