"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Static target date (replace with desired date)

const TARGET_DATE = new Date("2025-08-20T00:00:00");

// Function to calculate the time remaining

const calculateTimeRemaining = (TARGET_DATE: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(TARGET_DATE) - Number(currentTime), 0);

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const DealCountDown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    //Calculate Initial time on client
    setTime(calculateTimeRemaining(TARGET_DATE));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);
      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (!time) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Loader2 className="animate-spin w-5 h-5" />
          <h3 className="text-3xl font-bold">Loading Countdown...</h3>
        </div>
      </section>
    );
  }

  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-[1rem] md:text-3xl font-bold text-center">
            Deal is Ended
          </h3>
          <p className="text-center mx-2">
            This deal is no longer available. Check out our latest promotions
          </p>

          <div className="text-center">
            <Button asChild>
              <Link href="/search">View Products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/promo.jpg"
            alt="Product Promotion"
            width={300}
            height={200}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-[1rem] md:text-3xl font-bold text-center">
          Deal of the Month
        </h3>
        <p className="text-center mx-2">
          Don&apos;t miss our exclusive Deal of the Month! 🎉 Enjoy massive
          savings on one of our best-selling products 🛍️—available for a limited
          time only ⏳. Grab it now before it&apos;s gone and treat yourself to
          the best value this month! 💥
        </p>
        <ul className="grid grid-cols-4 mx-2">
          <StatBox label="days" value={time.days} />
          <StatBox label="hours" value={time.hours} />
          <StatBox label="minutes" value={time.minutes} />
          <StatBox label="seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href="/search">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src="/images/promo.jpg"
          alt="Product Promotion"
          width={300}
          height={200}
        />
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center">
    <p className="text-[1rem] md:text-3xl font-value">{value}</p>
    <p className="text-[.8rem] md:text-3xl font-value">{label}</p>
  </li>
);
export default DealCountDown;
