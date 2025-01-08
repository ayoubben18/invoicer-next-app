"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { textCapitalizer } from "@/utils/lib";
import React from "react";

type Props = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const CategoriesFilter = ({ onChange, options, value }: Props) => {
  return (
    <Select value={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="w-full md:w-1/4">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        {options.map((category, index) => (
          <SelectItem key={index} value={category!}>
            {textCapitalizer(category)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoriesFilter;
