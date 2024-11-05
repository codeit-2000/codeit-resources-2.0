import dayjs from "dayjs";
import { useState } from "react";

export default function Home() {
  const [time1, setTime1] = useState("14:30");
  const [time2, setTime2] = useState("16:45");
  const [result, setResult] = useState("");

  const compareTimes = () => {
    const parsedTime1 = dayjs(time1, "HH:mm");
    const parsedTime2 = dayjs(time2, "HH:mm");

    let resultText;

    console.log(parsedTime1, parsedTime2);

    if (parsedTime1.isBefore(parsedTime2)) {
      resultText = `${time1}은 ${time2} 이전입니다.`;
    } else if (parsedTime1.isAfter(parsedTime2)) {
      resultText = `${time1}은 ${time2} 이후입니다.`;
    } else {
      resultText = `${time1}은 ${time2}와 같습니다.`;
    }

    setResult(resultText);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>시간 비교기</h1>
      <label htmlFor="time1">시간 1 (HH:mm):</label>
      <input
        type="text"
        id="time1"
        value={time1}
        onChange={(e) => setTime1(e.target.value)}
      />
      <br />
      <br />
      <label htmlFor="time2">시간 2 (HH:mm):</label>
      <input
        type="text"
        id="time2"
        value={time2}
        onChange={(e) => setTime2(e.target.value)}
      />
      <br />
      <br />
      <button onClick={compareTimes} type="button">
        비교하기
      </button>
      <p>{result}</p>
    </div>
  );
}
