import { useEffect, useState } from "react";
import { IPractitioner } from "../models/IPractitioner";

export interface PractitionerListProps {
  onPractitionerSelected: (practitioner: IPractitioner) => void;
}

export function PractitionerList({ onPractitionerSelected }: PractitionerListProps) {
  const [supervisors, setSupervisors] = useState<IPractitioner[]>([]);
  const [practitioners, setPractitioners] = useState<IPractitioner[]>([]);

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
          (practitioner: IPractitioner) => !supervisors.some((supervisor) => supervisor.id === practitioner.id)
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
