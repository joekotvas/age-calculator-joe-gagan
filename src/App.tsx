import { useState } from "react";
import {
  validateDay,
  validateMonth,
  validateYear,
  getMaxDaysInMonth,
} from "./validationLogic";
import {
  subYears,
  subMonths,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from "date-fns";

import DateInputArea from "./DateInputArea";
import YearsOldArea from "./components/YearsOldArea";

export interface CalculatorDate {
  years: number | undefined;
  months: number | undefined;
  days: number | undefined;
}

export interface ErrorMessage {
  day: string | undefined;
  month: string | undefined;
  year: string | undefined;
}

function App() {
  const [errorMessage, setErrorMessage] = useState({
    day: undefined as string | undefined,
    month: undefined as string | undefined,
    year: undefined as string | undefined,
  } as ErrorMessage);

  const [theDate, setTheDate] = useState({
    days: 0,
    months: 0,
    years: 0,
  } as CalculatorDate);

  const [age, setAge] = useState({
    years: undefined,
    months: undefined,
    days: undefined,
  } as CalculatorDate);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = parseInt(e.target.value);

    validateDateInput(e, setErrorMessage);

    if (isNaN(value)) {
      setTheDate({
        ...theDate,
        [key]: 0,
      });
    } else {
      setTheDate({
        ...theDate,
        [key]: value,
      });
    }
  };

  function validateDateInput(
    e: React.ChangeEvent<HTMLInputElement>,
    setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage>>
  ) {
    const value = parseInt(e.target.value);
    const field: string = e.target.id;
    const lcField = field.toLowerCase();

    const day = field === "Day" ? value : theDate.days;
    const month = field === "Month" ? value : theDate.months;
    const year = field === "Year" ? value : theDate.years || 2000;

    console.log("theDate.days", theDate.days);
    console.log("day", day);
    console.log("month", month);
    console.log("year", year);

    const validator = {
      day: validateDay,
      month: validateMonth,
      year: validateYear,
    };

    setErrorMessage((msg) => ({
      ...msg,
      [lcField]: undefined,
    }));

    if (month && day && day > getMaxDaysInMonth(month, year)) {
      setErrorMessage((msg) => ({
        ...msg,
        day: `Must be a valid day`,
      }));
    } else {
      setErrorMessage((msg) => ({
        ...msg,
        day: undefined,
      }));
    }

    if (e.target.value === "") {
      setErrorMessage((msg) => ({
        ...msg,
        [lcField]: `${field} is required`,
      }));
    } else if (!validator[lcField](value)) {
      setErrorMessage((msg) => ({
        ...msg,
        [lcField]: `Must be a valid ${lcField}`,
      }));
    }
  }

  const onSubmit = () => {
    if (theDate.days && theDate.months && theDate.years) {
      setAge(
        calculateAge(new Date(theDate.years, theDate.months - 1, theDate.days))
      );
      setErrorMessage({
        year: undefined,
        day: undefined,
        month: undefined,
      });
    } else {
      setAge({
        years: undefined,
        months: undefined,
        days: undefined,
      });
    }
  };

  function getYears(date: Date, workingDate: Date = new Date()) {
    return differenceInYears(workingDate, date);
  }

  function getMonths(date: Date, workingDate: Date = new Date()) {
    return differenceInMonths(workingDate, date);
  }

  function getDays(date: Date, workingDate: Date = new Date()) {
    return differenceInDays(workingDate, date);
  }

  function calculateAge(date: Date) {
    let workingDate = new Date();
    const years = getYears(date, workingDate);
    workingDate = subYears(workingDate, years);
    const months = getMonths(date, workingDate);
    workingDate = subMonths(workingDate, months);
    const days = getDays(date, workingDate);
    return {
      years,
      months,
      days,
    } as CalculatorDate;
  }

  return (
    <>
      <main className="bg-white p-6 pb-12 md:p-14 rounded-[1.5rem] rounded-br-[100px] md:rounded-br-[12.5rem] mx-8 lg:w-[840px]">
        <DateInputArea
          theDate={theDate}
          errorMessage={errorMessage}
          onSubmit={onSubmit}
          handleInput={handleInput}
        />
        <YearsOldArea years={age.years} months={age.months} days={age.days} />
      </main>
    </>
  );
}

export default App;