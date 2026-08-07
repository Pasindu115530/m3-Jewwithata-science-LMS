"use client";

import React, { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  to?: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number; // in seconds
  duration?: number; // in seconds
  className?: string;
  startWhen?: boolean;
  separator?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  children?: React.ReactNode;
}

export function CountUp({
  to: toProp,
  from: fromProp,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  suffix: suffixProp = "",
  prefix: prefixProp = "",
  decimals = 0,
  children,
}: CountUpProps) {
  // Parse children if toProp is not explicitly provided
  let targetValue = toProp;
  let detectedSuffix = suffixProp;
  let detectedPrefix = prefixProp;

  if (targetValue === undefined && children !== undefined) {
    const str = String(children).trim();
    const match = str.match(/^([^\d-]*)([\d,.]+)([^\d]*)$/);
    if (match) {
      if (!prefixProp && match[1]) detectedPrefix = match[1];
      const parsedNum = parseFloat(match[2].replace(/,/g, ""));
      if (!isNaN(parsedNum)) targetValue = parsedNum;
      if (!suffixProp && match[3]) detectedSuffix = match[3];
    }
  }

  const finalTo = targetValue ?? 0;
  const startVal = direction === "down" ? finalTo : (fromProp ?? 0);
  const endVal = direction === "down" ? (fromProp ?? 0) : finalTo;

  // SSR-friendly: default to final value so crawlers read real numbers, client animation resets to startVal on mount
  const [displayValue, setDisplayValue] = useState<number>(endVal);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const elementRef = useRef<HTMLSpanElement>(null);


  useEffect(() => {
    if (!startWhen || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [startWhen, hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const startTimeDelay = delay * 1000;
    const durationMs = Math.max(duration * 1000, 100);

    timeoutId = setTimeout(() => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / durationMs, 1);

        // Ease out expo: 1 - Math.pow(2, -10 * progress)
        const easeOutProgress =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const currentVal = startVal + (endVal - startVal) * easeOutProgress;
        setDisplayValue(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setDisplayValue(endVal);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    }, startTimeDelay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [hasAnimated, startVal, endVal, duration, delay]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const [intPart, decPart] = fixed.split(".");
    const formattedInt = separator
      ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      : intPart;
    return decPart ? `${formattedInt}.${decPart}` : formattedInt;
  };

  return (
    <span ref={elementRef} className={className}>
      {detectedPrefix}
      {formatNumber(displayValue)}
      {detectedSuffix}
    </span>
  );
}
