"use client";
import React from "react";
import { usePropertyDescriptors } from "./propertyDescriptor";
import { PropertyInput } from "./propertyCard";

const PropertiesEditor = () => {
  const properties = usePropertyDescriptors();

  return (
    <div className="w-5/6 flex flex-row flex-wrap gap-4 mb-4 justify-center items-center">
      {properties.map((item, index) => (
        <PropertyInput key={index} item={item} />
      ))}
    </div>
  );
};

export default PropertiesEditor;
