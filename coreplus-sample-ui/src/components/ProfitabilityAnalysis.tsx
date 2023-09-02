import { Fragment, useEffect, useState } from "react";
import { IPractitioner } from "../models/IPractitioner";
import { IProfitabilityAnalysis } from "../models/IProfitabilityAnalysis";

export interface ProfitabilityAnalysisProps {
  selectedPractitioner: IPractitioner;
  range: [Date, Date | null];
}

export function ProfitabilityAnalysis({
  selectedPractitioner, range,
}: ProfitabilityAnalysisProps) {
  const [data, setData] = useState<IProfitabilityAnalysis[]>([]);

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
      `https://localhost:7091/appointments/profitability-analysis/${selectedPractitioner.id}?range=${range[0].toISOString()}&range=${range[1] ? range[1].toISOString() : new Date().toISOString()}`
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
