import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subYears } from "date-fns";
import "./app.css";

import { ProfitabilityAnalysis } from "./components/ProfitabilityAnalysis";
import { PractitionerList } from "./components/PractitionerList";
import { AppointmentList } from "./components/AppointmentList";
import { AppointmentDetails } from "./components/AppointmentDetails";
import { IAppointment } from "./models/IAppointment";
import { IPractitioner } from "./models/IPractitioner";

function App() {
  const [practitioner, setPractitioner] = useState<IPractitioner>();
  const [appointment, setAppointment] = useState<IAppointment>();
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
            <div className="border p-2 bg-primary shadow-sm">Appointment Details</div>
            <AppointmentDetails
              selectedAppointmentId={appointment.id}
            ></AppointmentDetails>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
