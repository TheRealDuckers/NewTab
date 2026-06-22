import { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const date = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="text-5xl sm:text-6xl md:text-7xl font-light mb-2 text-gray-800">
        {hours}:{minutes}
      </div>
      <div className="text-base sm:text-lg md:text-xl text-gray-600">{date}</div>
    </div>
  );
}