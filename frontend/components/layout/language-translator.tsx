"use client";

import { useEffect } from "react";
import { translations, useLanguage } from "@/hooks/use-language";

const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([english, khmer]) => [khmer, english]));

function translateValue(value: string, language: "en" | "km") {
  if (language === "km") {
    if (/\bmi\b/.test(value)) return value.replace(/\bmi\b/g, "km");

    const direct = translations[value];
    if (direct) return direct;

    const vehicleCount = value.match(/^(\d+) vehicles$/);
    if (vehicleCount) return `${vehicleCount[1]} រថយន្ត`;

    const stock = value.match(/^Stock #(.*)$/);
    if (stock) return `លេខសម្គាល់ #${stock[1]}`;

    const description = value.match(/^This meticulously selected (.+) blends exceptional performance with everyday refinement\. Fully inspected, beautifully presented, and ready for its next chapter\.$/);
    if (description) return `${description[1]} ដែលបានជ្រើសរើសយ៉ាងយកចិត្តទុកដាក់ ផ្តល់ទាំងសមត្ថភាពខ្ពស់ និងផាសុកភាពប្រចាំថ្ងៃ។ បានត្រួតពិនិត្យពេញលេញ និងរួចរាល់សម្រាប់ម្ចាស់ថ្មី។`;
  } else {
    if (/\bkm\b/.test(value)) return value.replace(/\bkm\b/g, "mi");

    const direct = reverseTranslations[value];
    if (direct) return direct;
  }

  return value;
}

function translateTextNode(node: Text, language: "en" | "km") {
  const original = node.nodeValue ?? "";
  const trimmed = original.trim();
  if (!trimmed) return;
  const translated = translateValue(trimmed, language);
  if (translated !== trimmed) node.nodeValue = original.replace(trimmed, translated);
}

function translatePage(language: "en" | "km") {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    if (parent && !["SCRIPT", "STYLE"].includes(parent.tagName)) translateTextNode(node as Text, language);
    node = walker.nextNode();
  }

  document.querySelectorAll<HTMLElement>("[placeholder], [title], [aria-label]").forEach((element) => {
    for (const attribute of ["placeholder", "title", "aria-label"]) {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, translateValue(value, language));
    }
  });
}

export function LanguageTranslator() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    let observer: MutationObserver | undefined;
    const timer = window.setTimeout(() => {
      translatePage(language);
      observer = new MutationObserver(() => translatePage(language));
      observer.observe(document.body, { childList: true, subtree: true });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [language]);

  return null;
}
