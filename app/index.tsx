import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  // Redirect to onboarding screen on app start
  return <Redirect href="/onboarding" />;
}
