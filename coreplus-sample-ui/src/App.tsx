import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subYears } from "date-fns";
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
  const [showAppointments, setShowAppointments] = useState(false);
  const [startDate, setStartDate] = useState(subYears(new Date(), 4));
  const [endDate, setEndDate] = useState(new Date());

  const handleChange = ([newStartDate, newEndDate]: [Date, Date]) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    console.table([newStartDate, newEndDate]);
  };

  return (
    <div className="h-screen w-full appshell">
      <div className="header flex flex-row items-center p-2 bg-primary shadow-sm">
        <p className="font-bold text-lg">coreplus</p>
      </div>
      <PractitionerList
        onPractitionerSelected={setPractitioner}
      ></PractitionerList>
      <div>
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
        {showAppointments && (
          <div className="appointlist">
            <div className="border p-2 bg-primary shadow-sm">Appointments</div>
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
    <div>
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

export default App;
