'use client';

import { useEffect, useState } from 'react';

export default function TodayDate() {
  const [date, setDate] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDate(new Date().toLocaleDateString('bn-BD', { dateStyle: 'long' }));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return <>{date}</>;
}
