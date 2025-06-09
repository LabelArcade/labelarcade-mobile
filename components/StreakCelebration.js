// components/StreakCelebration.js
import React, { useEffect, useState } from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function StreakCelebration({ trigger }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!showConfetti) return null;

  return (
    <ConfettiCannon
      count={80}
      origin={{ x: -10, y: 0 }}
      explosionSpeed={350}
      fallSpeed={3000}
      fadeOut={true}
    />
  );
}
